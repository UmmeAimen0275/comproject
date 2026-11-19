"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { BookOpen, Copy, GraduationCap, Loader2, Monitor, ShieldCheck, User, Utensils } from "lucide-react";

const PASSWORD = "Password123!";

// Where each role lands after signing in. Change if your routes differ.
const HOME: Record<string, string> = {
  STUDENT: "/student",
  DEPT_ADMIN: "/admin",
  SUPER_ADMIN: "/super",
};

const accounts = [
  { role: "Super Admin", note: "All departments, analytics", email: "super@campusconnect.com", icon: ShieldCheck, tint: "bg-indigo-100 text-indigo-700" },
  { role: "Cafeteria Admin", note: "Cafeteria complaints only", email: "cafeteria@campusconnect.com", icon: Utensils, tint: "bg-amber-100 text-amber-700" },
  { role: "Library Admin", note: "Library complaints only", email: "library@campusconnect.com", icon: BookOpen, tint: "bg-sky-100 text-sky-700" },
  { role: "IT Admin", note: "Labs and IT complaints only", email: "it@campusconnect.com", icon: Monitor, tint: "bg-violet-100 text-violet-700" },
  { role: "Academic Admin", note: "Teaching complaints only", email: "academic@campusconnect.com", icon: GraduationCap, tint: "bg-emerald-100 text-emerald-700" },
  { role: "Student", note: "Submit and track own complaints", email: "ali@example.com", icon: User, tint: "bg-rose-100 text-rose-700" },
];

// compact = true on the narrow login card (one column), false on the landing page
export function DemoAccounts({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function loginAs(email: string) {
    setBusy(email);
    // Same real login as the form, so every server rule still applies
    const res = await signIn("credentials", { email, password: PASSWORD, redirect: false });
    if (res?.error) {
      toast.error("Could not sign in. The database may be waking up. Try again.");
      setBusy(null);
      return;
    }
    // Read the role from the new session, then open that role's home page
    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    router.push((role && HOME[role]) || "/");
    router.refresh();
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  return (
    <div>
      <p className="mb-4 text-center text-sm text-muted-foreground">
        Password for every account:{" "}
        <button
          type="button"
          onClick={() => copy(PASSWORD)}
          className="rounded bg-muted px-2 py-0.5 font-mono font-semibold text-foreground hover:bg-accent"
        >
          {PASSWORD}
        </button>
      </p>

      <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
        {accounts.map((a) => (
          <div key={a.email} className="hover-lift rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${a.tint}`}>
                <a.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold leading-tight">{a.role}</p>
                <p className="truncate text-xs text-muted-foreground">{a.note}</p>
              </div>
            </div>
            <p className="mt-3 break-all text-xs text-muted-foreground">{a.email}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => loginAs(a.email)}
                disabled={busy !== null}
                className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {busy === a.email && <Loader2 className="size-4 animate-spin" />}
                Sign in as {a.role.split(" ")[0]}
              </button>
              <button
                type="button"
                onClick={() => copy(a.email)}
                aria-label={`Copy email of ${a.role}`}
                className="grid size-9 place-items-center rounded-lg border hover:bg-accent"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}