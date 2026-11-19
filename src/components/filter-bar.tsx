"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, Search, X } from "lucide-react";
import { fieldClass } from "@/lib/ui";
import { STATUS_LABEL } from "@/lib/format";

type Option = { value: string; label: string };
const VIEWS = [
  { value: "active", label: "Current" },
  { value: "handled", label: "History" },
  { value: "all", label: "All" },
];

export function FilterBar(props: {
  showStatus?: boolean;
  showView?: boolean;
  defaultView?: string;
  categories?: Option[];
  departments?: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  // WHY: filters live in the URL, so a page refresh or a shared link keeps them.
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  // WHY: wait 400 ms after typing, so we do not query on every key press.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q.trim()) update("q", q.trim());
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const view = params.get("view") ?? props.defaultView ?? "all";
  const hasFilters = ["q", "status", "category", "department"].some((k) => params.get(k));

  function clear() {
    setQ("");
    const keep = props.showView ? `?view=${view}` : "";
    startTransition(() => router.replace(`${pathname}${keep}`, { scroll: false }));
  }

  function Select(p: { label: string; param: string; all: string; options: Option[] }) {
    return (
      <select
        aria-label={p.label}
        value={params.get(p.param) ?? ""}
        onChange={(e) => update(p.param, e.target.value)}
        className={fieldClass}
      >
        <option value="">{p.all}</option>
        {p.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-3 shadow-xs" aria-busy={pending}>
      {props.showView && (
        <div role="tablist" aria-label="Complaint view" className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              type="button"
              role="tab"
              aria-selected={view === v.value}
              onClick={() => update("view", v.value)}
              className={`rounded-md px-2 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                view === v.value ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          {pending ? (
            <LoaderCircle className="absolute left-3 top-2.5 size-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          )}
          <input
            type="search"
            aria-label="Search complaints"
            placeholder="Search title, description, student..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${fieldClass} pl-9`}
            maxLength={80}
          />
        </div>

        {props.showStatus && (
          <Select
            label="Filter by status"
            param="status"
            all="All statuses"
            options={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
          />
        )}
        {props.departments && (
          <Select label="Filter by department" param="department" all="All departments" options={props.departments} />
        )}
        {props.categories && (
          <Select label="Filter by category" param="category" all="All categories" options={props.categories} />
        )}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clear}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" /> Clear filters
        </button>
      )}
    </div>
  );
}