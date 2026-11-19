import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

// WHY: params are a Promise in Next.js 15, so we await them.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  return (
    <AuthLayout>
      <LoginForm registered={registered === "1"} />
    </AuthLayout>
  );
}