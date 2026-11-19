"use client";

import { useActionState, useEffect, useState } from "react";
import { Building2, ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { createComplaintAction } from "@/app/actions/complaints";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cardClass, fieldClass } from "@/lib/ui";
import { MAX_IMAGE_BYTES } from "@/lib/validations/complaint";

type Category = { id: string; name: string; issues: string[]; department: string };

function Field(p: {
  id: string;
  label: string;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={p.id}>{p.label}</Label>
        {p.hint}
      </div>
      {p.children}
      {p.error && (
        <p id={`${p.id}-error`} role="alert" className="text-sm text-destructive">
          {p.error}
        </p>
      )}
    </div>
  );
}

export function ComplaintForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(createComplaintAction, {});
  const [categoryId, setCategoryId] = useState("");
  const [issueType, setIssueType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId);
  const fe = state.fieldErrors;

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    setFileError(null);
    if (!f) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(f.type)) {
      setFileError("Only PNG, JPG or WebP images.");
      return;
    }
    if (f.size > MAX_IMAGE_BYTES) {
      setFileError("Image must be 300 KB or smaller.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function removeFile() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  }

  return (
    <form
      // WHY: we add the image ourselves, so a failed submit does not lose it.
      action={(fd) => {
        if (file) fd.set("image", file);
        formAction(fd);
      }}
      className={`${cardClass} space-y-5`}
    >
      <Field id="categoryId" label="Category" error={fe?.categoryId?.[0]}>
        <select
          id="categoryId"
          name="categoryId"
          required
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setIssueType("");
          }}
          aria-invalid={!!fe?.categoryId}
          className={fieldClass}
        >
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      {/* WHY: shows the automatic routing to the student */}
      {category && (
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
          <Building2 className="size-4 shrink-0" />
          <p>
            Sent automatically to <strong>{category.department}</strong>.
          </p>
        </div>
      )}

      <Field id="issueType" label="Issue type" error={fe?.issueType?.[0]}>
        <select
          id="issueType"
          name="issueType"
          required
          disabled={!category}
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          aria-invalid={!!fe?.issueType}
          className={fieldClass}
        >
          <option value="">{category ? "Choose an issue type" : "Choose a category first"}</option>
          {category?.issues.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="title"
        label="Title"
        error={fe?.title?.[0]}
        hint={<span className="text-xs text-muted-foreground">{title.length}/100</span>}
      >
        <input
          id="title"
          name="title"
          required
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short summary of the problem"
          aria-invalid={!!fe?.title}
          className={fieldClass}
        />
      </Field>

      <Field
        id="description"
        label="Description"
        error={fe?.description?.[0]}
        hint={<span className="text-xs text-muted-foreground">{description.length}/1000</span>}
      >
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Where, when and what happened?"
          aria-invalid={!!fe?.description}
          className={fieldClass}
        />
      </Field>

      <Field
        id="image"
        label="Photo (optional, max 300 KB)"
        error={fileError ?? fe?.image?.[0]}
      >
        {preview ? (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected" className="max-h-40 rounded-lg border" />
            <button
              type="button"
              onClick={removeFile}
              aria-label="Remove image"
              className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-destructive text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground transition hover:bg-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <ImagePlus className="size-5" /> Add a photo
            <input id="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={onFile} className="sr-only" />
          </label>
        )}
      </Field>

      {/* Phase F: the AI category suggestion button goes here */}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> Submitting...
          </>
        ) : (
          "Submit complaint"
        )}
      </Button>
    </form>
  );
}