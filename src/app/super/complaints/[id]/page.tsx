import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getComplaint } from "@/lib/queries";
import { ComplaintDetail } from "@/components/complaint-detail";

export const dynamic = "force-dynamic";

// WHY: the super admin can read everything but cannot reply (no form here).
export default async function SuperComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("SUPER_ADMIN");
  const { id } = await params;
  const complaint = await getComplaint(user, id);
  if (!complaint) notFound();
  return <ComplaintDetail complaint={complaint} backHref="/super" showStudent />;
}