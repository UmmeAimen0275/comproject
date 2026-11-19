import { LoginForm } from "@/components/auth/login-form";

// WHY: params are a Promise in Next.js 15, so we await them.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginForm registered={registered === "1"} />
    </main>
  );
}