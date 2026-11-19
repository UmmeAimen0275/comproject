"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Status } from "@prisma/client";
import type { DashboardData } from "@/lib/analytics";
import { STATUS_LABEL } from "@/lib/format";

// WHY: hex colors, because SVG charts do not read Tailwind classes.
const BRAND = "#4338ca";
const STATUS_COLOR: Record<Status, string> = {
  PENDING: "#f59e0b",
  IN_PROGRESS: "#3b82f6",
  RESOLVED: "#10b981",
  REJECTED: "#ef4444",
};
const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

function ChartCard(p: { title: string; subtitle: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`rounded-xl border bg-card p-4 shadow-xs sm:p-5 ${p.className ?? ""}`}>
      <h2 className="font-semibold">{p.title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{p.subtitle}</p>
      {p.children}
    </section>
  );
}

function Empty() {
  return (
    <p className="grid h-56 place-items-center text-sm text-muted-foreground">
      No data yet. Charts fill up as complaints arrive.
    </p>
  );
}

export function DashboardCharts({
  data,
  showDepartments = false,
}: {
  data: DashboardData;
  showDepartments?: boolean;
}) {
  const pie = (Object.keys(STATUS_COLOR) as Status[]).map((k) => ({
    key: k,
    name: STATUS_LABEL[k],
    value: data.counts[k],
  }));
  const maxIssue = data.issues[0]?.count ?? 1;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* 1. REQUIRED: bar chart of complaints per department (super admin) */}
      {showDepartments && (
        <ChartCard
          title="Complaints per department"
          subtitle="Which office receives the most complaints"
          className="lg:col-span-2"
        >
          {data.total === 0 ? (
            <Empty />
          ) : (
            <div className="h-64 w-full" role="img" aria-label="Bar chart of complaints per department">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={data.departments} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#eef2ff" }} />
                  <Bar dataKey="count" name="Complaints" fill={BRAND} radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      )}

      {/* 2. Status donut */}
      <ChartCard title="Status overview" subtitle="Share of each status">
        {data.total === 0 ? (
          <Empty />
        ) : (
          <>
            <div className="relative h-44 w-full" role="img" aria-label="Donut chart of complaint statuses">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={78} paddingAngle={2} stroke="none">
                    {pie.map((p) => (
                      <Cell key={p.key} fill={STATUS_COLOR[p.key]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="text-2xl font-bold">{data.resolutionRate}%</p>
                  <p className="text-[11px] text-muted-foreground">resolved</p>
                </div>
              </div>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {pie.map((p) => (
                <li key={p.key} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: STATUS_COLOR[p.key] }} />
                  <span className="text-muted-foreground">{p.name}</span>
                  <span className="ml-auto font-semibold">{p.value}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </ChartCard>

      {/* 3. Trend (last 14 days) */}
      <ChartCard title="Complaints trend" subtitle="New complaints in the last 14 days" className="lg:col-span-2">
        <div className="h-56 w-full" role="img" aria-label="Area chart of new complaints per day">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data.trend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" minTickGap={24} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="count" name="New complaints" stroke={BRAND} strokeWidth={2.5} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 4. Top issues: plain HTML bars, perfect on a 360px phone */}
      <ChartCard
        title="Most reported issues"
        subtitle="Top 5 issue types"
        className={showDepartments ? "" : "lg:col-span-3"}
      >
        {data.issues.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-3">
            {data.issues.map((i) => (
              <li key={i.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="truncate">{i.name}</span>
                  <span className="font-semibold">{i.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(i.count / maxIssue) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </ChartCard>
    </div>
  );
}