import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/validations/auth";

// WHY: when the email does not exist we still run bcrypt on this fake hash.
// Then "wrong email" and "wrong password" take the same time.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, role: {} },
      async authorize(credentials) {
        // 1. Validate input with Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password, role } = parsed.data;

        // 2. Find the user
        const user = await withRetry(() =>
          prisma.user.findUnique({ where: { email } })
        );

        // 3. Check the password
        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user || !ok) return null;

        // 4. The role tab must match the real role in the database
        if (user.role !== role) return null;

        // 5. Audit log (a log failure must never block login)
        await prisma.auditLog
          .create({ data: { userId: user.id, action: "LOGIN", targetId: user.id } })
          .catch(() => {});

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
        };
      },
    }),
  ],
});