import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { requireRole } from "@/lib/session";
import { getComplaint } from "@/lib/queries";
import { ComplaintDetail } from "@/components/complaint-detail";
import { RespondForm } from "@/components/admin/respond-form";
import { cardClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function AdminComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("DEPT_ADMIN");
  const { id } = await params;
  // WHY: the Library admin opening an IT complaint gets null here -> 404.
  const complaint = await getComplaint(user, id);
  if (!complaint) notFound();

  const closed = complaint.status === "RESOLVED" || complaint.status === "REJECTED";
  return (
    <ComplaintDetail complaint={complaint} backHref="/admin" showStudent>
      {closed ? (
        <div className={`${cardClass} flex items-start gap-3 text-sm`}>
          <CircleCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <p>This complaint is closed. It stays in your History tab.</p>
        </div>
      ) : (
        <RespondForm complaintId={complaint.id} currentStatus={complaint.status} />
      )}
    </ComplaintDetail>
  );
}