import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// WHY: a separate client so this script runs without Next.js.
const prisma = new PrismaClient();

async function main() {
  const departments = await prisma.department.findMany({
    include: { categories: true, admins: true },
    orderBy: { name: "asc" },
  });

  console.log("\n=== DEPARTMENTS ===");
  for (const d of departments) {
    console.log(`${d.name} (${d.slug}) | admins: ${d.admins.length}`);
    for (const c of d.categories) {
      console.log(`   category: ${c.name} | issue types: ${c.issues.length}`);
    }
  }

  const users = await prisma.user.findMany({
    include: { department: true },
    orderBy: { role: "asc" },
  });

  console.log("\n=== USERS ===");
  for (const u of users) {
    // WHY: proves the stored hash really matches the demo password.
    const ok = await bcrypt.compare("Password123!", u.passwordHash);
    console.log(
      `${u.email} | ${u.role} | ${u.department?.name ?? "-"} | password ok: ${ok}`
    );
  }

  console.log("\n=== COUNTS ===");
  console.log("departments:", await prisma.department.count());
  console.log("categories:", await prisma.category.count());
  console.log("users:", await prisma.user.count());
  console.log("complaints:", await prisma.complaint.count());
}

main()
  .catch((e) => console.error("DB check failed:", e.message))
  .finally(() => prisma.$disconnect());