"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// WHY: demo hints help the judges. Remove them for a real product.
const ROLES = [
  { value: "STUDENT", label: "Student", demo: "ali@example.com" },
  { value: "DEPT_ADMIN", label: "Dept Admin", demo: "library@campusconnect.com" },
  { value: "SUPER_ADMIN", label: "Super Admin", demo: "super@campusconnect.com" },
] as const;

export function LoginForm({ registered }: { registered: boolean }) {
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("STUDENT");
  const [state, formAction, pending] = useActionState(loginAction, {});
  const current = ROLES.find((r) => r.value === role)!;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in to CampusConnect</CardTitle>
        <CardDescription>Choose your role, then enter your details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registered && (
          <p role="status" className="rounded-md bg-muted p-3 text-sm">
            Account created. Please sign in.
          </p>
        )}

        {/* Role tabs */}
        <div role="tablist" aria-label="Choose role" className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              role="tab"
              aria-selected={role === r.value}
              onClick={() => setRole(r.value)}
              className={`rounded-md px-2 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                role === r.value ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form action={formAction} className="space-y-4">
          {/* WHY: the server checks this role against the database */}
          <input type="hidden" name="role" value={role} />

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          Demo: {current.demo} / Password123!
        </p>

        {role === "STUDENT" && (
          <p className="text-sm">
            New student?{" "}
            <Link href="/register" className="font-medium underline">
              Create an account
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}