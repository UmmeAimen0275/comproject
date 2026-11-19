import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

// WHY: the type extension lives in this file, so TypeScript always sees it.
// (A separate .d.ts file was not picked up.)
declare module "next-auth" {
  interface User {
    role: Role;
    departmentId: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      departmentId: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// WHY: this file has NO database and NO bcrypt, so it can run in the
// middleware (edge runtime). The full login code is in auth.ts.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  providers: [],
  callbacks: {
    // WHY: put id, role, departmentId into the token at login.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.departmentId = user.departmentId;
      }
      return token;
    },
    // WHY: copy them from the token to the session we read in pages.
    // "as" tells TypeScript the real types (we set them in the jwt callback).
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.user.departmentId = (token.departmentId as string | null) ?? null;
      return session;
    },
    // WHY: the middleware calls this for every page. First gate of access control.
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;
      const go = (to: string) => Response.redirect(new URL(to, nextUrl));

      if (path === "/") return true;

      if (path === "/login" || path === "/register") {
        return user ? go("/dashboard") : true; // logged-in users skip login
      }

      if (!user) return false; // sends to /login

      if (path.startsWith("/student") && user.role !== "STUDENT") return go("/dashboard");
      if (path.startsWith("/admin") && user.role !== "DEPT_ADMIN") return go("/dashboard");
      if (path.startsWith("/super") && user.role !== "SUPER_ADMIN") return go("/dashboard");
      return true;
    },
  },
} satisfies NextAuthConfig;