// WHY: shared Tailwind classes. Same look everywhere, less repeated code.
export const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive disabled:cursor-not-allowed disabled:opacity-50";

export const cardClass = "rounded-xl border bg-card p-4 shadow-xs sm:p-5";

export const linkButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";