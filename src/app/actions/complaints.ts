"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { requireRole } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import { toSafeDataUrl } from "@/lib/image";
import {
  createComplaintSchema,
  respondSchema,
  type ActionState,
} from "@/lib/validations/complaint";

export async function createComplaintAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Role check (student only). The student id comes from the session.
  const user = await requireRole("STUDENT");

  // 2. Zod
  const parsed = createComplaintSchema.safeParse({
    categoryId: formData.get("categoryId"),
    issueType: formData.get("issueType"),
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  // 3. Rate limit: 10 complaints per hour per student
  const limit = rateLimit(`complaint:${user.id}`, 10, 60 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Too many complaints. Try again in ${limit.retryAfterMin} minutes.` };
  }

  // 4. Optional image
  let attachment: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const result = await toSafeDataUrl(file);
    if ("error" in result) return { fieldErrors: { image: [result.error] } };
    attachment = result.dataUrl;
  }

  // 5. AUTO-ROUTING: the department comes from the category in the database.
  // The student can never choose or send a department.
  const category = await withRetry(() =>
    prisma.category.findUnique({ where: { id: parsed.data.categoryId } })
  );
  if (!category || !category.issues.includes(parsed.data.issueType)) {
    return { error: "Please choose a valid category and issue type." };
  }

  let id = "";
  try {
    const created = await withRetry(() =>
      prisma.complaint.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          issueType: parsed.data.issueType,
          attachment,
          studentId: user.id,
          categoryId: category.id,
          departmentId: category.departmentId,
        },
        select: { id: true },
      })
    );
    id = created.id;
  } catch {
    return { error: "Could not submit your complaint. Please try again." };
  }

  await logAudit(user.id, "COMPLAINT_CREATED", id);
  revalidatePath("/student");
  // WHY: redirect must be outside try/catch.
  redirect(`/student/complaints/${id}`);
}

export async function respondAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  // 1. Only a department admin
  const user = await requireRole("DEPT_ADMIN");
  const departmentId = user.departmentId;
  if (!departmentId) return { error: "No department is assigned to your account." };

  // 2. Zod (a reason/response is always required)
  const parsed = respondSchema.safeParse({
    complaintId: formData.get("complaintId"),
    status: formData.get("status"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  const { complaintId, status, message } = parsed.data;

  // 3. DEPARTMENT ISOLATION: the complaint must be in MY department.
  const complaint = await withRetry(() =>
    prisma.complaint.findFirst({
      where: { id: complaintId, departmentId },
      select: { id: true, status: true },
    })
  );
  if (!complaint) return { error: "You cannot manage this complaint." };

  // 4. A closed complaint is final.
  if (complaint.status === "RESOLVED" || complaint.status === "REJECTED") {
    return { error: "This complaint is already closed." };
  }

  // 5. Timeline entry + new status, together (all or nothing).
  try {
    await prisma.$transaction([
      prisma.complaintUpdate.create({
        data: { complaintId, adminId: user.id, message, newStatus: status },
      }),
      prisma.complaint.update({ where: { id: complaintId }, data: { status } }),
    ]);
  } catch {
    return { error: "Could not save your response. Please try again." };
  }

  await logAudit(user.id, `STATUS_${status}`, complaintId);
  revalidatePath(`/admin/complaints/${complaintId}`);
  revalidatePath("/admin");
  return { success: "Response sent to the student." };
}