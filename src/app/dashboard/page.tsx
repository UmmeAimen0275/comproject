import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

// WHY: one entry point. It sends each role to its own home.
const HOME = {
  STUDENT: "/student",
  DEPT_ADMIN: "/admin",
  SUPER_ADMIN: "/super",
} as const;

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  redirect(HOME[session.user.role]);
}