import { requireRole } from "@/lib/session";
import { AppShell } from "@/components/app-shell";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole("STUDENT");
  return (
    <AppShell
      name={user.name ?? ""}
      roleLabel="Student"
      links={[
        { href: "/student", label: "My complaints", exact: true },
        { href: "/student/new", label: "New complaint" },
      ]}
    >
      {children}
    </AppShell>
  );
}