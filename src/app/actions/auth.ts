"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import {
  loginSchema,
  registerSchema,
  type FormState,
} from "@/lib/validations/auth";

// WHY: the IP is part of the rate limit key.
async function getIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function registerAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // WHY: max 5 sign-ups per hour from one IP.
  const limit = rateLimit(`register:${await getIp()}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Too many sign-ups. Try again in ${limit.retryAfterMin} minutes.` };
  }

  const { name, email, password } = parsed.data;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    // WHY: role is FIXED to STUDENT here. It never comes from the form,
    // so nobody can register as an admin.
    const user = await withRetry(() =>
      prisma.user.create({
        data: { name, email, passwordHash, role: Role.STUDENT },
      })
    );
    await prisma.auditLog.create({
      data: { userId: user.id, action: "REGISTER", targetId: user.id },
    });
  } catch (e) {
    // P2002 = unique rule broken = email already exists
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { fieldErrors: { email: ["This email is already registered."] } };
    }
    return { error: "Could not create the account. Please try again." };
  }

  // WHY: redirect must be OUTSIDE try/catch (it works by throwing).
  redirect("/login?registered=1");
}

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };

  const { email, password, role } = parsed.data;

  // WHY: max 5 tries per 15 minutes for the same IP + email.
  const key = `login:${await getIp()}:${email}`;
  const limit = rateLimit(key, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${limit.retryAfterMin} minutes.` };
  }

  try {
    await signIn("credentials", { email, password, role, redirectTo: "/dashboard" });
  } catch (e) {
    // WHY: one generic message. We never say which part was wrong.
    if (e instanceof AuthError) return { error: "Wrong email, password or role." };
    // Success also "throws" a redirect. Reset the counter and pass it on.
    resetRateLimit(key);
    throw e;
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}