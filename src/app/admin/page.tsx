import { requireRole } from "@/lib/session";
import { listComplaints } from "@/lib/queries";
import { getDashboardData } from "@/lib/analytics";
import { parseFilters } from "@/lib/validations/complaint";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "@/components/stat-cards";
import { DashboardCharts } from "@/components/charts/dashboard-charts";
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
  const [items, data] = await Promise.all([
    listComplaints(user, { ...f, view }),
    getDashboardData(user),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Department dashboard" subtitle="Only your department's complaints are shown." />
      <StatCards counts={data.counts} />
      <DashboardCharts data={data} />
      <h2 className="pt-2 text-lg font-semibold">Complaints</h2>
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