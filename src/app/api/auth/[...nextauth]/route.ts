import { handlers } from "@/auth";

// WHY: Auth.js needs these two routes (GET and POST) for sessions.
export const { GET, POST } = handlers;