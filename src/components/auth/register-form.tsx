"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
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

// WHY: one small component for label + input + error. Less repeated code.
function Field(props: {
  id: string;
  label: string;
  type?: string;
  autoComplete: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{props.label}</Label>
      <Input
        id={props.id}
        name={props.id}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        required
        aria-invalid={!!props.error}
        aria-describedby={props.error ? `${props.id}-error` : undefined}
      />
      {props.error && (
        <p id={`${props.id}-error`} role="alert" className="text-sm text-destructive">
          {props.error}
        </p>
      )}
    </div>
  );
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, {});
  const fe = state.fieldErrors;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Create student account</CardTitle>
        <CardDescription>Only students can register here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={formAction} className="space-y-4">
          <Field id="name" label="Full name" autoComplete="name" error={fe?.name?.[0]} />
          <Field id="email" label="Email" type="email" autoComplete="email" error={fe?.email?.[0]} />
          <Field id="password" label="Password" type="password" autoComplete="new-password" error={fe?.password?.[0]} />
          <Field id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" error={fe?.confirmPassword?.[0]} />

          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}