import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { getComplaint } from "@/lib/queries";
import { ComplaintDetail } from "@/components/complaint-detail";

export const dynamic = "force-dynamic";

export default async function StudentComplaintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("STUDENT");
  const { id } = await params; // WHY: params is a Promise in Next.js 15
  // WHY: scope = my own complaints only. Someone else's id returns null.
  const complaint = await getComplaint(user, id);
  if (!complaint) notFound();
  return <ComplaintDetail complaint={complaint} backHref="/student" />;
}