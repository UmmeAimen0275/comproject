import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_DOT, formatDate } from "@/lib/format";
import { cardClass } from "@/lib/ui";
import type { ComplaintFull } from "@/lib/queries";

export function ComplaintDetail(props: {
  complaint: ComplaintFull;
  backHref: string;
  showStudent?: boolean;
  children?: React.ReactNode; // the admin respond form goes here
}) {
  const c = props.complaint;
  const info: [string, string][] = [
    ["Category", c.category.name],
    ["Issue type", c.issueType],
    ["Department", c.department.name],
    ["Submitted", formatDate(c.createdAt)],
  ];
  if (props.showStudent) info.push(["Student", `${c.student.name} (${c.student.email})`]);

  return (
    <div className="space-y-4">
      <Link href={props.backHref} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className={props.children ? "grid gap-6 lg:grid-cols-3" : "grid gap-6"}>
        <div className={`space-y-6 ${props.children ? "lg:col-span-2" : ""}`}>
          <section className={cardClass}>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl font-bold tracking-tight">{c.title}</h1>
              <StatusBadge status={c.status} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {info.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="break-words font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-5 text-sm font-semibold">Description</h2>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{c.description}</p>

            {c.attachment && (
              <>
                <h2 className="mt-5 text-sm font-semibold">Attached image</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.attachment}
                  alt="Attached by the student"
                  className="mt-2 max-h-80 w-auto max-w-full rounded-lg border object-contain"
                />
              </>
            )}
          </section>

          <section className={cardClass} aria-labelledby="timeline-title">
            <h2 id="timeline-title" className="mb-4 font-semibold">Status timeline</h2>
            <ol className="relative ml-3 space-y-6 border-l pl-6">
              <li className="relative">
                <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary ring-4 ring-card" />
                <p className="text-sm font-medium">Complaint submitted</p>
                <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
              </li>
              {c.updates.map((u) => (
                <li key={u.id} className="relative">
                  <span className={`absolute -left-[31px] top-1 size-3 rounded-full ring-4 ring-card ${STATUS_DOT[u.newStatus]}`} />
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">Status changed to</p>
                    <StatusBadge status={u.newStatus} />
                  </div>
                  <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-muted p-3 text-sm">{u.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {u.admin.name} · {formatDate(u.createdAt)}
                  </p>
                </li>
              ))}
            </ol>
            {c.updates.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Waiting for a response from {c.department.name}.
              </p>
            )}
          </section>
        </div>

        {props.children && <aside>{props.children}</aside>}
      </div>
    </div>
  );
}