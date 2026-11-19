import type { Status } from "@prisma/client";
import { CircleCheck, CircleX, Clock, Inbox, LoaderCircle } from "lucide-react";
import { STATUS_LABEL } from "@/lib/format";

const ITEMS = [
  { key: "TOTAL", icon: Inbox, color: "text-primary bg-primary/10" },
  { key: "PENDING", icon: Clock, color: "text-amber-700 bg-amber-100" },
  { key: "IN_PROGRESS", icon: LoaderCircle, color: "text-blue-700 bg-blue-100" },
  { key: "RESOLVED", icon: CircleCheck, color: "text-emerald-700 bg-emerald-100" },
  { key: "REJECTED", icon: CircleX, color: "text-red-700 bg-red-100" },
] as const;

export function StatCards({ counts }: { counts: Record<Status, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ITEMS.map(({ key, icon: Icon, color }) => (
        <div
          key={key}
          className={`rounded-xl border bg-card p-4 shadow-xs ${key === "TOTAL" ? "col-span-2 sm:col-span-1" : ""}`}
        >
          <span className={`mb-2 grid size-8 place-items-center rounded-lg ${color}`}>
            <Icon className="size-4" />
          </span>
          <p className="text-2xl font-bold">{key === "TOTAL" ? total : counts[key]}</p>
          <p className="text-xs text-muted-foreground">
            {key === "TOTAL" ? "Total" : STATUS_LABEL[key]}
          </p>
        </div>
      ))}
    </div>
  );
}