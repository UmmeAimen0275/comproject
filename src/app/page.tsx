import Link from "next/link";
import {
  ArrowRight, BarChart3, BookOpen, CheckCircle2, ClipboardCheck, Clock, GraduationCap,
  Lock, MessageSquareReply, Monitor, Route, ShieldCheck, Utensils,
} from "lucide-react";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { DemoAccounts } from "@/components/demo-accounts";

const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90";
const btnOutline =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border bg-card px-6 text-sm font-medium transition hover:bg-accent";

const offices = [
  { icon: Utensils, name: "Cafeteria", dept: "Cafeteria Administration", items: "Food quality, prices, variety, staff", tint: "bg-amber-100 text-amber-700" },
  { icon: BookOpen, name: "Library", dept: "Library Administration", items: "Books, seating, hours, librarian", tint: "bg-sky-100 text-sky-700" },
  { icon: Monitor, name: "Labs and IT", dept: "Laboratory / IT Administration", items: "Computers, internet, projectors, software", tint: "bg-violet-100 text-violet-700" },
  { icon: GraduationCap, name: "Teaching", dept: "Academic Administration", items: "Late lectures, notes, explanations", tint: "bg-emerald-100 text-emerald-700" },
];

const steps = [
  { icon: ClipboardCheck, title: "Submit", text: "Choose a category and an issue type. Add a photo if it helps." },
  { icon: Route, title: "We route it", text: "The system sends it to the correct administration office." },
  { icon: MessageSquareReply, title: "Get an answer", text: "Read the response and follow every status change." },
];

const features = [
  { icon: Route, title: "Automatic routing", text: "Pick a category. The right department gets it. No guessing." },
  { icon: Clock, title: "Live status tracking", text: "Pending, in progress, resolved or rejected, with a full timeline." },
  { icon: Lock, title: "Private by design", text: "Students see only their own complaints. Admins see only their department." },
  { icon: ShieldCheck, title: "Secure sign in", text: "Hashed passwords, role checks on the server and rate limiting." },
  { icon: BarChart3, title: "Clear analytics", text: "Charts show which departments need attention the most." },
  { icon: CheckCircle2, title: "Reasons are required", text: "Every resolved or rejected complaint comes with an explanation." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar: sticky, blurred, fits a phone */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <MessageSquareReply className="size-4" />
            </span>
            CampusConnect
          </Link>
          <nav className="flex items-center gap-1 text-sm sm:gap-2">
            <a href="#demo" className="hidden rounded-md px-3 py-2 hover:bg-accent sm:block">Demo accounts</a>
            <Link href="/login" className="rounded-md px-3 py-2 hover:bg-accent">Sign in</Link>
            <Link href="/register" className="rounded-lg bg-primary px-3 py-2 font-medium text-primary-foreground hover:opacity-90 sm:px-4">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-bg overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
          <div className="fade-up text-center lg:text-left">
            <span className="inline-block rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-primary">
              Smart campus complaint system
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Your voice reaches the{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">right office</span>, fast.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
              Report a problem on campus in one minute. CampusConnect sends it to the correct department and keeps you updated until it is solved.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/register" className={btnPrimary}>
                Get started <ArrowRight className="size-4" />
              </Link>
              <a href="#demo" className={btnOutline}>Try a demo account</a>
            </div>
          </div>

          {/* Sample complaint card with a status timeline */}
          <div className="float mx-auto w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl">
            <p className="text-xs text-muted-foreground">Laboratories and IT · Projector problems</p>
            <p className="mt-1 font-semibold">Projector not working in Lab 3</p>
            <span className="mt-2 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              In progress
            </span>
            <ol className="mt-5 space-y-4 border-l pl-5">
              {[
                { t: "Complaint submitted", s: "Routed to IT Administration", c: "bg-indigo-600" },
                { t: "Status: In progress", s: "A technician will fix it today.", c: "bg-blue-500" },
                { t: "Resolved", s: "You will see the reason here.", c: "bg-muted-foreground/40" },
              ].map((x) => (
                <li key={x.t} className="relative">
                  <span className={`absolute -left-[26px] top-1 size-3 rounded-full ${x.c}`} />
                  <p className="text-sm font-medium">{x.t}</p>
                  <p className="text-xs text-muted-foreground">{x.s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-4 py-8 text-center">
          {[
            { n: 4, l: "Departments" },
            { n: 3, l: "User roles" },
            { n: 4, l: "Status stages" },
          ].map((x) => (
            <div key={x.l}>
              <p className="text-3xl font-extrabold text-primary sm:text-4xl"><CountUp to={x.n} /></p>
              <p className="text-xs text-muted-foreground sm:text-sm">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offices */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">Four offices, one simple form</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Each category belongs to one department. You never have to know who to contact.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((o, i) => (
            <Reveal key={o.name} delay={i * 80}>
              <div className="hover-lift h-full rounded-xl border bg-card p-5">
                <span className={`mb-4 grid size-11 place-items-center rounded-xl ${o.tint}`}>
                  <o.icon className="size-5" />
                </span>
                <h3 className="font-semibold">{o.name}</h3>
                <p className="text-xs font-medium text-primary">{o.dept}</p>
                <p className="mt-2 text-sm text-muted-foreground">{o.items}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 px-4 py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">How it works</h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="relative h-full rounded-xl border bg-card p-6 text-center">
                <span className="absolute -top-3 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <s.icon className="mx-auto mb-3 size-8 text-primary" />
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-center text-3xl font-bold">Built to be fair, fast and safe</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="hover-lift flex h-full gap-4 rounded-xl border bg-card p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                  <f.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Demo accounts */}
      <section id="demo" className="scroll-mt-20 bg-muted/50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center text-3xl font-bold">Try it in one click</h2>
            <p className="mx-auto mb-8 mt-2 max-w-xl text-center text-muted-foreground">
              Sign in as any role to see what each one can and cannot do.
            </p>
          </Reveal>
          <DemoAccounts />
        </div>
      </section>

      {/* Call to action */}
      <section className="px-4 py-16">
        <div className="brand-panel mx-auto max-w-4xl rounded-2xl px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to be heard?</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            Create a free student account and send your first complaint today.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-indigo-700 transition hover:scale-105"
          >
            Create student account
          </Link>
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        CampusConnect · BIIT Software Engineering Society Competition
      </footer>
    </div>
  );
}