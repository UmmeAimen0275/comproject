import { requireRole } from "@/lib/session";
import { getCategories } from "@/lib/queries";
import { PageHeader } from "@/components/page-header";
import { ComplaintForm } from "@/components/student/complaint-form";

export const dynamic = "force-dynamic";

export default async function NewComplaintPage() {
  await requireRole("STUDENT");
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New complaint" subtitle="Pick a category. We send it to the right office." />
      <ComplaintForm categories={categories} />
    </div>
  );
}