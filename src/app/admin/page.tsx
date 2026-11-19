import { requireRole } from "@/lib/session";
import { listComplaints, statusCounts } from "@/lib/queries";
import { parseFilters } from "@/lib/validations/complaint";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "@/components/stat-cards";
import { FilterBar } from "@/components/filter-bar";
import { ComplaintList } from "@/components/complaint-list";

export const dynamic = "force-dynamic";

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireRole("DEPT_ADMIN");
  const f = parseFilters(await searchParams);
  const view = f.view ?? "active"; // default: current complaints
  const [items, counts] = await Promise.all([
    listComplaints(user, { ...f, view }),
    statusCounts(user),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Department complaints" subtitle="Only your department's complaints are shown." />
      <StatCards counts={counts} />
      <FilterBar showView defaultView="active" />
      <ComplaintList
        items={items}
        basePath="/admin/complaints"
        showStudent
        emptyTitle="Nothing here"
        emptyText={
          view === "handled"
            ? "No handled complaints yet."
            : "No complaints match. New ones appear here automatically."
        }
      />
    </div>
  );
}