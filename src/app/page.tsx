import Link from "next/link";

// WHY: public home page with the two entry points.
const btn =
  "rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">CampusConnect</h1>
      <p className="text-muted-foreground">
        Smart Campus Complaint and Feedback Management System
      </p>
      <div className="flex gap-3">
        <Link href="/login" className={`${btn} bg-primary text-primary-foreground`}>
          Sign in
        </Link>
        <Link href="/register" className={`${btn} border`}>
          Student sign up
        </Link>
      </div>
    </main>
  );
}