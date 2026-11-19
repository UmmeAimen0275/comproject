import { requireRole } from "@/lib/session";
import { getFilterOptions, listComplaints, statusCounts } from "@/lib/queries";
import { parseFilters } from "@/lib/validations/complaint";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "@/components/stat-cards";
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
  const [items, counts, options] = await Promise.all([
    listComplaints(user, f),
    statusCounts(user),
    getFilterOptions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="All complaints" subtitle="Search and filter across every department." />
      {/* Phase E adds the charts here */}
      <StatCards counts={counts} />
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