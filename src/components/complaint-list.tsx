import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import type { ComplaintListItem } from "@/lib/queries";

export function ComplaintList(props: {
  items: ComplaintListItem[];
  basePath: string; // e.g. /student/complaints
  showStudent?: boolean;
  showDepartment?: boolean;
  emptyTitle: string;
  emptyText: string;
  emptyAction?: React.ReactNode;
}) {
  // WHY: a friendly empty state, not a blank page.
  if (props.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted">
          <Inbox className="size-6 text-muted-foreground" />
        </span>
        <h2 className="font-semibold">{props.emptyTitle}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{props.emptyText}</p>
        {props.emptyAction}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {props.items.map((c) => (
        <li key={c.id}>
          <Link
            href={`${props.basePath}/${c.id}`}
            className="group block rounded-xl border bg-card p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 font-semibold">{c.title}</h2>
              <StatusBadge status={c.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {c.category.name} · {c.issueType}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{formatDate(c.createdAt)}</span>
              {props.showStudent && <span>By {c.student.name}</span>}
              {props.showDepartment && <span>{c.department.name}</span>}
              <ArrowRight className="ml-auto size-4 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}