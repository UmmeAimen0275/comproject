import type { Prisma, Role, Status } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { idSchema, type Filters } from "@/lib/validations/complaint";

export type Viewer = { id: string; role: Role; departmentId: string | null };

// WHY: THE ISOLATION RULE. Every query adds this filter.
// Student -> own complaints. Dept admin -> own department. Super admin -> all.
export function scopeWhere(user: Viewer): Prisma.ComplaintWhereInput {
  if (user.role === "STUDENT") return { studentId: user.id };
  if (user.role === "DEPT_ADMIN") {
    return { departmentId: user.departmentId ?? "no-department" };
  }
  return {};
}

export async function listComplaints(user: Viewer, f: Filters) {
  const and: Prisma.ComplaintWhereInput[] = [scopeWhere(user)];

  if (f.status) and.push({ status: f.status });
  else if (f.view === "active") and.push({ status: { in: ["PENDING", "IN_PROGRESS"] } });
  else if (f.view === "handled") and.push({ status: { in: ["RESOLVED", "REJECTED"] } });

  if (f.q) {
    and.push({
      OR: [
        { title: { contains: f.q, mode: "insensitive" } },
        { description: { contains: f.q, mode: "insensitive" } },
        { issueType: { contains: f.q, mode: "insensitive" } },
        { student: { name: { contains: f.q, mode: "insensitive" } } },
      ],
    });
  }

  // WHY: only the super admin may filter by category/department.
  // (Even a forged URL cannot leak data, because scopeWhere is always in the AND.)
  if (user.role === "SUPER_ADMIN") {
    if (f.category) and.push({ categoryId: f.category });
    if (f.department) and.push({ departmentId: f.department });
  }

  return withRetry(() =>
    prisma.complaint.findMany({
      where: { AND: and },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        issueType: true,
        status: true,
        createdAt: true,
        category: { select: { name: true } },
        department: { select: { name: true } },
        student: { select: { name: true } },
      },
    })
  );
}
export type ComplaintListItem = Awaited<ReturnType<typeof listComplaints>>[number];

// WHY: id AND scope together. Wrong department or wrong owner = null = 404.
export async function getComplaint(user: Viewer, id: string) {
  if (!idSchema.safeParse(id).success) return null;
  return withRetry(() =>
    prisma.complaint.findFirst({
      where: { id, ...scopeWhere(user) },
      include: {
        category: { select: { name: true } },
        department: { select: { name: true } },
        student: { select: { name: true, email: true } },
        updates: {
          orderBy: { createdAt: "asc" },
          include: { admin: { select: { name: true } } },
        },
      },
    })
  );
}
export type ComplaintFull = NonNullable<Awaited<ReturnType<typeof getComplaint>>>;

export async function statusCounts(user: Viewer) {
  const rows = await withRetry(() =>
    prisma.complaint.groupBy({
      by: ["status"],
      where: scopeWhere(user),
      _count: { _all: true },
    })
  );
  const counts: Record<Status, number> = {
    PENDING: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    REJECTED: 0,
  };
  for (const r of rows) counts[r.status] = r._count._all;
  return counts;
}

export async function getCategories() {
  const rows = await withRetry(() =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        issues: true,
        department: { select: { name: true } },
      },
    })
  );
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    issues: c.issues,
    department: c.department.name,
  }));
}

export async function getFilterOptions() {
  const [categories, departments] = await Promise.all([
    withRetry(() => prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })),
    withRetry(() => prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })),
  ]);
  return {
    categories: categories.map((c) => ({ value: c.id, label: c.name })),
    departments: departments.map((d) => ({ value: d.id, label: d.name })),
  };
}