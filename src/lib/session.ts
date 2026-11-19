import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/auth";

// WHY: SECOND gate. Every protected page and action calls this on the server.
// The middleware is not enough alone. We will reuse this in Phase D.
export async function requireRole(...roles: Role[]) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!roles.includes(session.user.role)) redirect("/dashboard");
  return session.user;
}