import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";
import { scopeWhere, statusCounts, type Viewer } from "@/lib/queries";

const DAYS = 14;
// WHY: fixed timezone, so "today" is the same on the server and in the browser.
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }); // 2026-11-19
const dayLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", day: "2-digit", month: "short" });

export async function getDashboardData(user: Viewer) {
  // WHY: the SAME isolation rule as the lists. A dept admin only counts own complaints.
  const where = scopeWhere(user);
  const since = new Date(Date.now() - DAYS * 864e5);

  const [counts, deptRows, departments, recent, issueRows] = await Promise.all([
    statusCounts(user),
    withRetry(() =>
      prisma.complaint.groupBy({ by: ["departmentId"], where, _count: { _all: true } })
    ),
    withRetry(() => prisma.department.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } })),
    withRetry(() =>
      prisma.complaint.findMany({
        where: { AND: [where, { createdAt: { gte: since } }] },
        select: { createdAt: true },
      })
    ),
    withRetry(() =>
      prisma.complaint.groupBy({ by: ["issueType"], where, _count: { _all: true } })
    ),
  ]);

  // Complaints per department (departments with 0 still show in the chart)
  const deptCount = new Map(deptRows.map((r) => [r.departmentId, r._count._all]));
  const departmentsData = departments.map((d) => ({
    name: d.name.replace(" Administration", ""),
    count: deptCount.get(d.id) ?? 0,
  }));

  // Trend: one bucket per day for the last 14 days
  const buckets = new Map<string, { label: string; count: number }>();
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    buckets.set(dayKey.format(d), { label: dayLabel.format(d), count: 0 });
  }
  for (const r of recent) {
    const b = buckets.get(dayKey.format(r.createdAt));
    if (b) b.count += 1;
  }

  // Top 5 issue types
  const issues = issueRows
    .map((r) => ({ name: r.issueType, count: r._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const resolutionRate = total ? Math.round((counts.RESOLVED / total) * 100) : 0;

  return {
    counts,
    total,
    resolutionRate,
    departments: departmentsData,
    trend: [...buckets.values()],
    issues,
  };
}
export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;