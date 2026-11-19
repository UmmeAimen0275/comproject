import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { DemoAccounts } from "@/components/demo-accounts";

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

      {/* Judges can sign in as any role with one click */}
      <details className="mt-6 rounded-xl border bg-card p-3 text-sm">
        <summary className="cursor-pointer font-medium">Demo accounts (one-click sign in)</summary>
        <div className="mt-4">
          <DemoAccounts compact />
        </div>
      </details>
    </AuthLayout>
  );
}