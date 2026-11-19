import { Flame, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { withRetry } from "@/lib/retry";

// departmentId = a department's id (department admin), or null (super admin: all)
export async function RecurringIssues({ departmentId }: { departmentId: string | null }) {
  const scope = departmentId ? { departmentId } : {};

  const groups = await withRetry(() =>
    prisma.complaint.groupBy({
      by: ["issueType"],
      where: scope,
      _count: { _all: true },
      orderBy: { _count: { issueType: "desc" } },
      take: 5,
    })
  );

  // "Me too" votes make an issue weigh more (queries run in parallel)
  const rows = await Promise.all(
    groups.map(async (g) => {
      const votes = await withRetry(() =>
        prisma.complaintSupport.count({
          where: { complaint: { issueType: g.issueType, ...scope } },
        })
      );
      return { issue: g.issueType, reports: g._count._all, votes, total: g._count._all + votes };
    })
  );
  rows.sort((a, b) => b.total - a.total);
  const max = rows[0]?.total ?? 1;

  return (
    <section className="rounded-xl border bg-card p-4 shadow-xs sm:p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <Flame className="size-4 text-amber-500" /> Recurring issues
      </h2>
      <p className="mb-4 text-xs text-muted-foreground">
        Reports plus &quot;Me too&quot; support from other students
      </p>

      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No recurring issues yet.</p>
      ) : (
        <ol className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.issue} className="hover-lift rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.issue}</span>
                <span className="text-sm font-bold">{r.total}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${(r.total / max) * 100}%` }}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                {r.reports} report{r.reports === 1 ? "" : "s"}
                <Users className="ml-2 size-3" /> {r.votes} support
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}