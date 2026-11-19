import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/session";
import { listComplaints, statusCounts } from "@/lib/queries";
import { parseFilters } from "@/lib/validations/complaint";
import { linkButton } from "@/lib/ui";
import { PageHeader } from "@/components/page-header";
import { StatCards } from "@/components/stat-cards";
import { FilterBar } from "@/components/filter-bar";
import { ComplaintList } from "@/components/complaint-list";

export const dynamic = "force-dynamic";

export default async function StudentHome({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireRole("STUDENT");
  const f = parseFilters(await searchParams);
  const [items, counts] = await Promise.all([listComplaints(user, f), statusCounts(user)]);
  const filtered = Boolean(f.q || f.status);
  const newLink = (
    <Link href="/student/new" className={linkButton}>
      <Plus className="size-4" /> New complaint
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My complaints"
        subtitle="Track the status and read the replies."
        action={newLink}
      />
      <StatCards counts={counts} />
      <FilterBar showStatus />
      <ComplaintList
        items={items}
        basePath="/student/complaints"
        emptyTitle={filtered ? "No matching complaints" : "No complaints yet"}
        emptyText={
          filtered
            ? "Try a different search or clear the filters."
            : "Have a problem on campus? Tell us and the right office will answer."
        }
        emptyAction={filtered ? undefined : newLink}
      />
    </div>
  );
}