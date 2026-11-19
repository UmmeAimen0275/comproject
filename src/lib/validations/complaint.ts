import { z } from "zod";

// WHY: all complaint rules in one place. The server checks every input.
export const MAX_IMAGE_BYTES = 300 * 1024; // 300 KB

export type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const idSchema = z.string().min(1).max(40);

export const createComplaintSchema = z.object({
  categoryId: idSchema,
  issueType: z.string().min(1, "Choose an issue type.").max(120),
  title: z.string().trim().min(5, "Title needs at least 5 characters.").max(100),
  description: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters.")
    .max(1000),
});

// WHY: an admin can only set these 3. A complaint never goes back to PENDING.
export const respondSchema = z.object({
  complaintId: idSchema,
  status: z.enum(["IN_PROGRESS", "RESOLVED", "REJECTED"], {
    message: "Choose a status.",
  }),
  message: z
    .string()
    .trim()
    .min(5, "Write a response or reason (at least 5 characters).")
    .max(500),
});

const filterSchema = z.object({
  q: z.string().trim().max(80).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]).optional(),
  view: z.enum(["active", "handled", "all"]).optional(),
  category: z.string().max(40).optional(),
  department: z.string().max(40).optional(),
});
export type Filters = z.infer<typeof filterSchema>;

// WHY: URL values are user input too. Validate them, ignore bad ones.
export function parseFilters(
  raw: Record<string, string | string[] | undefined>
): Filters {
  const flat: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const s = Array.isArray(v) ? v[0] : v;
    if (s) flat[k] = s;
  }
  const result = filterSchema.safeParse(flat);
  return result.success ? result.data : {};
}