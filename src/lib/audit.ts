import { prisma } from "@/lib/prisma";

// WHY: a log failure must never break the real action.
export async function logAudit(userId: string, action: string, targetId?: string) {
  try {
    await prisma.auditLog.create({ data: { userId, action, targetId } });
  } catch {
    /* ignore */
  }
}