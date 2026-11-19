import { PrismaClient, Priority, Status } from "@prisma/client";
import { withRetry } from "../src/lib/retry";

const prisma = new PrismaClient();
const HOUR = 36e5;
const DAY = 864e5;

const CAF = "Cafeteria";
const LIB = "Library";
const IT = "Laboratories & IT Facilities";
const ACD = "Teaching & Academic Affairs";

type Demo = {
  cat: string;
  i: number; // index of the issue type inside the category
  title: string;
  desc: string;
  by: "ali" | "fatima" | "hamza";
  ago: number; // days ago
  status: Status;
  pri?: Priority;
  reply?: string;
  me?: ("ali" | "fatima" | "hamza")[]; // "Me too" supporters (used in Phase F)
};

const DEMO: Demo[] = [
  // Cafeteria
  { cat: CAF, i: 0, title: "Stale food served at lunch", desc: "The rice at lunch today was cold and smelled bad. Many students left it on the plate.", by: "ali", ago: 1, status: "PENDING", pri: "HIGH", me: ["fatima", "hamza"] },
  { cat: CAF, i: 0, title: "Unclean tables and counters", desc: "Tables in the cafeteria are sticky and nobody cleans them during the lunch break.", by: "hamza", ago: 3, status: "IN_PROGRESS", reply: "Cleaning staff were told to wipe the tables every hour." },
  { cat: CAF, i: 1, title: "Tea price increased suddenly", desc: "A cup of tea was 40 rupees last week and now it is 60 rupees with no notice.", by: "fatima", ago: 6, status: "RESOLVED", reply: "Prices were checked and corrected to the official rates." },
  { cat: CAF, i: 2, title: "Only rice and chicken every day", desc: "The menu has not changed for weeks. We need more choices, like vegetables or lentils.", by: "ali", ago: 9, status: "REJECTED", reply: "The menu is fixed by the contract this semester. We will review it next term." },
  { cat: CAF, i: 3, title: "Rude behaviour at the counter", desc: "The counter staff shouted at a student who asked for the price of a sandwich.", by: "hamza", ago: 12, status: "RESOLVED", reply: "The staff member was spoken to and received a warning." },

  // Library
  { cat: LIB, i: 0, title: "Old edition of the Data Structures book", desc: "The library only has a 2009 edition. Our course now uses a newer edition with new chapters.", by: "ali", ago: 2, status: "PENDING", me: ["hamza"] },
  { cat: LIB, i: 2, title: "Library closes too early before exams", desc: "The library closes at 4 PM even during exam week. Please keep it open until 8 PM.", by: "fatima", ago: 4, status: "IN_PROGRESS", reply: "We are discussing extended exam hours with the management." },
  { cat: LIB, i: 3, title: "No seats in the reading hall", desc: "After 11 AM there are no free seats, so many students study on the floor.", by: "hamza", ago: 5, status: "PENDING", me: ["fatima"] },
  { cat: LIB, i: 1, title: "Librarian not available in the morning", desc: "The issue desk was empty from 8 to 10 AM on three days this week.", by: "ali", ago: 8, status: "RESOLVED", reply: "A second librarian now covers the morning shift." },
  { cat: LIB, i: 0, title: "Missing books for the Database course", desc: "None of the reference books for the Database Systems course are in the library.", by: "fatima", ago: 11, status: "REJECTED", reply: "This duplicates an existing request that is already being processed." },

  // Laboratories & IT
  { cat: IT, i: 0, title: "Lab 2 computers will not start", desc: "Six computers in Lab 2 do not turn on. The lab class could not start today.", by: "hamza", ago: 0, status: "PENDING", pri: "HIGH", me: ["fatima"] },
  { cat: IT, i: 1, title: "WiFi is very slow in Block B", desc: "The internet in Block B is almost unusable. Pages take minutes to open during class.", by: "ali", ago: 1, status: "IN_PROGRESS", pri: "HIGH", reply: "Our network team is checking the access points in Block B.", me: ["hamza", "fatima"] },
  { cat: IT, i: 2, title: "Projector not working in Lab 3", desc: "The projector in Lab 3 shows a blue screen, so the teacher cannot show slides.", by: "fatima", ago: 2, status: "IN_PROGRESS", reply: "A technician will check and fix it this week." },
  { cat: IT, i: 3, title: "MATLAB is not installed in the lab", desc: "We need MATLAB for the Signals course, but it is missing on all lab computers.", by: "ali", ago: 7, status: "RESOLVED", reply: "MATLAB is now installed on all lab computers." },
  { cat: IT, i: 1, title: "No internet connection in the library", desc: "The library WiFi has not worked for two days. We cannot access online journals.", by: "hamza", ago: 10, status: "RESOLVED", reply: "The router was replaced and the connection works again." },
  { cat: IT, i: 0, title: "Keyboards are broken in Lab 1", desc: "Many keys do not work on the keyboards in Lab 1. Typing code is very hard.", by: "fatima", ago: 13, status: "RESOLVED", reply: "All broken keyboards in Lab 1 were replaced." },
  { cat: IT, i: 1, title: "WiFi disconnects every few minutes", desc: "In the cafeteria area the WiFi disconnects every few minutes and I lose my session.", by: "fatima", ago: 3, status: "PENDING", me: ["ali"] },

  // Teaching & Academic
  { cat: ACD, i: 0, title: "Teacher arrives 20 minutes late", desc: "The teacher of the morning class comes 20 minutes late almost every day this month.", by: "ali", ago: 0, status: "PENDING" },
  { cat: ACD, i: 1, title: "Lecture notes are not shared", desc: "We were promised lecture notes online, but nothing has been uploaded for three weeks.", by: "hamza", ago: 3, status: "PENDING", me: ["fatima"] },
  { cat: ACD, i: 2, title: "Topics are explained too fast", desc: "The teacher finishes a full chapter in one lecture and does not answer questions.", by: "fatima", ago: 6, status: "IN_PROGRESS", reply: "The head of department will meet the teacher this week." },
  { cat: ACD, i: 3, title: "Noise in the classroom during lectures", desc: "Some students talk loudly during lectures and the teacher does not stop them.", by: "ali", ago: 9, status: "RESOLVED", reply: "Class discipline rules were explained to all students." },
  { cat: ACD, i: 0, title: "Teacher often cancels the class", desc: "The Monday class was cancelled four times this month without any notice.", by: "hamza", ago: 12, status: "REJECTED", reply: "We could not verify this. Please send the dates and the course name and submit again." },
  { cat: ACD, i: 1, title: "Slides for Week 5 are missing", desc: "The slides for Week 5 are not on the portal and the quiz is next week.", by: "ali", ago: 1, status: "PENDING" },
];

const students = await withRetry(() => prisma.user.findMany({ where: { role: "STUDENT" } }));
  const sid = (k: string) => students.find((s) => s.email === `${k}@example.com`)!.id;

  const categories = new Map((await prisma.category.findMany()).map((c) => [c.name, c]));
  const admins = new Map(
    (await prisma.user.findMany({ where: { role: "DEPT_ADMIN" } })).map((a) => [a.departmentId, a])
  );

  // WHY: delete ONLY the demo students' complaints, so you can run this many times.
  // Updates and supports are deleted too (onDelete: Cascade in the schema).
  await prisma.complaint.deleteMany({ where: { studentId: { in: students.map((s) => s.id) } } });

  const now = Date.now();
  let n = 0;
  for (const d of DEMO) {
    const cat = categories.get(d.cat)!;
    const admin = admins.get(cat.departmentId)!;
    const createdAt = new Date(now - d.ago * DAY - (n % 7) * HOUR);
    // WHY: an answer can never be dated in the future.
    const at = (hours: number) => new Date(Math.min(now, createdAt.getTime() + hours * HOUR));

    const complaint = await prisma.complaint.create({
      data: {
        title: d.title,
        description: d.desc,
        issueType: cat.issues[d.i],
        status: d.status,
        priority: d.pri ?? "MEDIUM",
        studentId: sid(d.by),
        categoryId: cat.id,
        departmentId: cat.departmentId, // routing comes from the category
        createdAt,
      },
    });

    const updates: { message: string; newStatus: Status; createdAt: Date }[] = [];
    if (d.status === "IN_PROGRESS") {
      updates.push({ message: d.reply!, newStatus: "IN_PROGRESS", createdAt: at(5) });
    }
    if (d.status === "RESOLVED") {
      updates.push({ message: "We received your complaint and started working on it.", newStatus: "IN_PROGRESS", createdAt: at(4) });
      updates.push({ message: d.reply!, newStatus: "RESOLVED", createdAt: at(30) });
    }
    if (d.status === "REJECTED") {
      updates.push({ message: d.reply!, newStatus: "REJECTED", createdAt: at(20) });
    }
    if (updates.length) {
      await prisma.complaintUpdate.createMany({
        data: updates.map((u) => ({ complaintId: complaint.id, adminId: admin.id, ...u })),
      });
    }

    const supporters = (d.me ?? []).filter((k) => k !== d.by);
    if (supporters.length) {
      await prisma.complaintSupport.createMany({
        data: supporters.map((k) => ({ complaintId: complaint.id, userId: sid(k) })),
        skipDuplicates: true,
      });
    }
    n++;
  }
  console.log(`Demo data ready: ${n} complaints.`);

