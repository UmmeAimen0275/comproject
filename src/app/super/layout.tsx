import { requireRole } from "@/lib/session";
import { AppShell } from "@/components/app-shell";

export default async function SuperLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("SUPER_ADMIN");
  return (
    <AppShell
      name={user.name ?? ""}
      roleLabel="Super Admin"
      links={[{ href: "/super", label: "All complaints" }]}
    >
      {children}
    </AppShell>
  );
}