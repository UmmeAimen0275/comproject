import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CircleCheck,
  Clock,
  GraduationCap,
  Lock,
  Monitor,
  Route,
  School,
  ShieldCheck,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

// WHY: static data, so the page never touches the database and never fails.
const FEATURES = [
  { icon: Route, title: "Automatic routing", text: "Pick a category. The right department gets it. No guessing." },
  { icon: Clock, title: "Live status tracking", text: "Pending, in progress, resolved or rejected, with a full timeline." },
  { icon: ShieldCheck, title: "Private by design", text: "Students see only their own complaints. Admins see only their department." },
  { icon: Lock, title: "Secure sign in", text: "Hashed passwords, role checks on the server and rate limiting." },
  { icon: TrendingUp, title: "Clear analytics", text: "Charts show which departments need attention the most." },
  { icon: CircleCheck, title: "Reasons are required", text: "Every resolved or rejected complaint comes with an explanation." },
];

const STEPS = [
  { n: "1", title: "Submit", text: "Choose a category and an issue type. Add a photo if it helps." },
  { n: "2", title: "We route it", text: "The system sends it to the correct administration office." },
  { n: "3", title: "Get an answer", text: "Read the response and follow every status change." },
];

const DEPARTMENTS = [
  { icon: UtensilsCrossed, name: "Cafeteria", office: "Cafeteria Administration" },
  { icon: BookOpen, name: "Library", office: "Library Administration" },
  { icon: Monitor, name: "Laboratories & IT", office: "Laboratory / IT Administration" },
  { icon: School, name: "Teaching & Academic", office: "Academic Administration" },
];

const btn =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            CampusConnect
          </Link>
          <nav className="flex items-center gap-2">
            <a href="#how" className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground sm:block">
              How it works
            </a>
            <Link href="/login" className={`${btn} h-9 bg-primary text-primary-foreground hover:bg-primary/90`}>
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b hero-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
          <div className="fade-up space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary">
              <span className="size-2 rounded-full bg-primary" /> Smart campus complaint system
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Your voice reaches the <span className="text-primary">right office</span>, fast.
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Report a problem on campus in one minute. CampusConnect sends it to the correct
              department and keeps you updated until it is solved.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className={`${btn} bg-primary text-primary-foreground shadow-sm hover:bg-primary/90`}>
                Get started <ArrowRight className="size-4" />
              </Link>
              <Link href="/login" className={`${btn} border bg-background hover:bg-muted`}>
                Sign in
              </Link>
            </div>
          </div>

          {/* A sample complaint card (static preview) */}
          <div className="fade-up fade-up-2 mx-auto w-full max-w-md">
            <div className="rounded-2xl border bg-card p-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">Projector not working in Lab 3</p>
                  <p className="text-sm text-muted-foreground">Laboratories & IT · Projector problems</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  In progress
                </span>
              </div>
              <ol className="relative mt-5 ml-3 space-y-5 border-l pl-6 text-sm">
                <li className="relative">
                  <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary ring-4 ring-card" />
                  <p className="font-medium">Complaint submitted</p>
                  <p className="text-xs text-muted-foreground">Routed to IT Administration</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-blue-500 ring-4 ring-card" />
                  <p className="font-medium">Status: In progress</p>
                  <p className="mt-1 rounded-lg bg-muted p-2 text-xs">A technician will fix it today.</p>
                </li>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-emerald-500 ring-4 ring-card" />
                  <p className="font-medium">Resolved</p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold tracking-tight">Four offices, one simple form</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
          Each category belongs to one department. You never have to know who to contact.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map(({ icon: Icon, name, office }) => (
            <div key={name} className="rounded-xl border bg-card p-5 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
              <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="size-3" /> {office}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold tracking-tight">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {s.n}
                </span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold tracking-tight">Built to be fair, fast and safe</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border bg-card p-5 shadow-xs transition hover:shadow-md">
              <Icon className="size-6 text-primary" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold">Ready to be heard?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm opacity-90">
            Create a free student account and send your first complaint today.
          </p>
          <Link href="/register" className={`${btn} mt-5 bg-background text-foreground hover:bg-background/90`}>
            Create student account
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        CampusConnect · BIIT Software Engineering Society Competition
      </footer>
    </div>
  );
}