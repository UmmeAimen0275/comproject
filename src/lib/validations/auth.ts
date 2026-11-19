import { z } from "zod";

// WHY: one place for all auth rules. The server checks every input with these.
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

// WHY: max 72 because bcrypt only reads the first 72 bytes.
const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(72, "Use at most 72 characters.")
  .regex(/[A-Za-z]/, "Add at least one letter.")
  .regex(/[0-9]/, "Add at least one number.");

const email = z.string().trim().toLowerCase().email("Enter a valid email.");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(60),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
  role: z.enum(["STUDENT", "DEPT_ADMIN", "SUPER_ADMIN"]),
});