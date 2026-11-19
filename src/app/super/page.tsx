import { requireRole } from "@/lib/session";
import { getFilterOptions, listComplaints } from "@/lib/queries";
import { getDashboardData } from "@/lib/analytics";
import { parseFilters } from "@/lib/validations/complaint";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "@/components/stat-cards";
import { DashboardCharts } from "@/components/charts/dashboard-charts";
import { RecurringIssues } from "@/components/recurring-issues";
import { Reveal } from "@/components/reveal";
import { FilterBar } from "@/components/filter-bar";
import { ComplaintList } from "@/components/complaint-list";

export const dynamic = "force-dynamic";

export default async function SuperHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireRole("SUPER_ADMIN");
  const f = parseFilters(await searchParams);
  const [items, data, options] = await Promise.all([
    listComplaints(user, f),
    getDashboardData(user),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Analytics and every complaint across all departments." />
      <div className="fade-up">
        <StatCards counts={data.counts} />
      </div>
      <Reveal delay={60}>
        <DashboardCharts data={data} showDepartments />
      </Reveal>
      <Reveal delay={100}>
        <RecurringIssues departmentId={null} />
      </Reveal>
      <h2 className="pt-2 text-lg font-semibold">All complaints</h2>
      <FilterBar showStatus categories={options.categories} departments={options.departments} />
      <ComplaintList
        items={items}
        basePath="/super/complaints"
        showStudent
        showDepartment
        emptyTitle="No complaints found"
        emptyText="Try a different search or clear the filters."
      />
    </div>
  );
}