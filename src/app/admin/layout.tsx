import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { AppShell } from "@/components/app-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("DEPT_ADMIN");
  const departmentId = user.departmentId;
  const dept = departmentId
    ? await withRetry(() => prisma.department.findUnique({ where: { id: departmentId } }))
    : null;
  return (
    <AppShell
      name={user.name ?? ""}
      roleLabel={dept?.name ?? "Department Admin"}
      links={[{ href: "/admin", label: "Complaints" }]}
    >
      {children}
    </AppShell>
  );
}