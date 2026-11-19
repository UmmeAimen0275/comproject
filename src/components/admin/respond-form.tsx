"use client";

import { useActionState, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { respondAction } from "@/app/actions/complaints";
import { Button } from "@/components/ui/button";
import { cardClass, fieldClass } from "@/lib/ui";
import type { ActionState } from "@/lib/validations/complaint";

const OPTIONS = [
  { value: "IN_PROGRESS", label: "In progress", hint: "We are working on it." },
  { value: "RESOLVED", label: "Resolved", hint: "The problem is fixed." },
  { value: "REJECTED", label: "Rejected", hint: "We cannot accept this complaint." },
];

export function RespondForm({
  complaintId,
  currentStatus,
}: {
  complaintId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(
    currentStatus === "PENDING" ? "IN_PROGRESS" : currentStatus
  );
  const [message, setMessage] = useState("");

  // WHY: we show the toast here, before the page re-renders.
  const [state, formAction, pending] = useActionState(
    async (prev: ActionState, fd: FormData) => {
      const result = await respondAction(prev, fd);
      if (result.success) {
        toast.success(result.success);
        setMessage("");
      } else if (result.error) toast.error(result.error);
      return result;
    },
    {}
  );
  const fe = state.fieldErrors;
  const closing = status === "RESOLVED" || status === "REJECTED";

  return (
    <form action={formAction} className={`${cardClass} space-y-4 lg:sticky lg:top-28`}>
      <h2 className="font-semibold">Respond to student</h2>
      <input type="hidden" name="complaintId" value={complaintId} />

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-medium">New status</legend>
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <input
              type="radio"
              name="status"
              value={o.value}
              checked={status === o.value}
              onChange={() => setStatus(o.value)}
              className="mt-1 accent-primary"
            />
            <span>
              <span className="block font-medium">{o.label}</span>
              <span className="text-xs text-muted-foreground">{o.hint}</span>
            </span>
          </label>
        ))}
        {fe?.status && <p role="alert" className="text-sm text-destructive">{fe.status[0]}</p>}
      </fieldset>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="message" className="text-sm font-medium">
            {closing ? "Reason (required)" : "Response"}
          </label>
          <span className="text-xs text-muted-foreground">{message.length}/500</span>
        </div>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!fe?.message}
          className={fieldClass}
          placeholder="The student will read this message."
        />
        {fe?.message && <p role="alert" className="text-sm text-destructive">{fe.message[0]}</p>}
      </div>

      {closing && (
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Resolved and rejected complaints are final. You cannot change them later.
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send response"
        )}
      </Button>
    </form>
  );
}