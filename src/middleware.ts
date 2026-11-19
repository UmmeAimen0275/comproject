import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// WHY: runs before every page. It uses the edge-safe config only.
export default NextAuth(authConfig).auth;

export const config = {
  // WHY: skip api routes and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};