import Link from "next/link";
import { GraduationCap, ShieldCheck, Route, Clock } from "lucide-react";

const POINTS = [
  { icon: Route, text: "Complaints go to the right office automatically" },
  { icon: Clock, text: "Follow every status change in a timeline" },
  { icon: ShieldCheck, text: "Your complaints stay private" },
];

// WHY: a brand panel on big screens, a clean form on phones.
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10" />
        <Link href="/" className="relative flex items-center gap-2 text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-lg bg-white/15">
            <GraduationCap className="size-5" />
          </span>
          CampusConnect
        </Link>
        <div className="relative space-y-6">
          <h2 className="max-w-md text-3xl font-extrabold leading-tight">
            Report it once. We make sure the right office sees it.
          </h2>
          <ul className="space-y-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="grid size-8 place-items-center rounded-full bg-white/15">
                  <Icon className="size-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs opacity-80">Smart Campus Complaint and Feedback Management</p>
      </aside>

      <main className="fade-up flex flex-col items-center justify-center gap-4 p-4 sm:p-8">
        {/* WHY: on phones the brand panel is hidden, so show a small logo link */}
        <Link href="/" className="flex items-center gap-2 font-bold lg:hidden">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-4" />
          </span>
          CampusConnect
        </Link>
        {children}
      </main>
    </div>
  );
}