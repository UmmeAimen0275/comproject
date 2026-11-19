import { PrismaClient } from "@prisma/client";

// In development Next.js reloads often. Without this trick every reload would
// open a NEW database connection and we would run out of connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;