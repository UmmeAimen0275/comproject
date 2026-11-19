import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// The 4 departments, their category and the predefined issue types (from the brief)
const departments = [
  {
    slug: "cafeteria",
    name: "Cafeteria Administration",
    category: "Cafeteria",
    issues: ["Poor food quality or hygiene", "High food prices", "Limited food variety", "Staff behaviour or poor service"],
    adminName: "Cafeteria Admin",
    adminEmail: "cafeteria@campusconnect.com",
  },
  {
    slug: "library",
    name: "Library Administration",
    category: "Library",
    issues: ["Insufficient or outdated books", "Librarian availability or behaviour", "Opening and closing hours", "Insufficient seating or study space"],
    adminName: "Library Admin",
    adminEmail: "library@campusconnect.com",
  },
  {
    slug: "it",
    name: "Laboratory / IT Administration",
    category: "Laboratories & IT Facilities",
    issues: ["Non-functional computers", "Internet connectivity issues", "Projector or multimedia problems", "Missing or unavailable software"],
    adminName: "IT Admin",
    adminEmail: "it@campusconnect.com",
  },
  {
    slug: "academic",
    name: "Teaching / Academic Administration",
    category: "Teaching & Academic Affairs",
    issues: ["Teacher arriving late", "Lecture notes unavailable", "Inadequate explanation of topics", "Classroom management or discipline"],
    adminName: "Academic Admin",
    adminEmail: "academic@campusconnect.com",
  },
];

async function main() {
  // Hash once. All demo accounts share this password.
  const passwordHash = await bcrypt.hash("Password123!", 10);

  for (const d of departments) {
    // upsert = create if missing, update if it exists (safe to run many times)
    const dept = await prisma.department.upsert({
      where: { slug: d.slug },
      update: { name: d.name },
      create: { slug: d.slug, name: d.name },
    });

    // The category is linked to its department: this is the auto-routing
    await prisma.category.upsert({
      where: { name: d.category },
      update: { issues: d.issues, departmentId: dept.id },
      create: { name: d.category, issues: d.issues, departmentId: dept.id },
    });

    // One predefined admin per department
    await prisma.user.upsert({
      where: { email: d.adminEmail },
      update: {},
      create: {
        name: d.adminName,
        email: d.adminEmail,
        passwordHash,
        role: Role.DEPT_ADMIN,
        departmentId: dept.id,
      },
    });
  }

  // The Super Admin sees everything
  await prisma.user.upsert({
    where: { email: "super@campusconnect.com" },
    update: {},
    create: { name: "Super Admin", email: "super@campusconnect.com", passwordHash, role: Role.SUPER_ADMIN },
  });

  // Demo students
  for (const s of [
    { name: "Ali Raza", email: "ali@example.com" },
    { name: "Fatima Noor", email: "fatima@example.com" },
    { name: "Hamza Khan", email: "hamza@example.com" },
  ]) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { ...s, passwordHash, role: Role.STUDENT },
    });
  }

  console.log("Seeded.");
}

main().finally(() => prisma.$disconnect());