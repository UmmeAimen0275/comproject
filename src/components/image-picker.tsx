"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";

const MAX_SIDE = 1024; // longest side in pixels
const MAX_CHARS = 450_000; // max size of the saved text (about 330 KB image)

// Shrinks the photo in the browser. WHY: phone photos are 3-8 MB, too big for the database.
function compress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      URL.revokeObjectURL(url);
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Not a valid image"));
    };
    img.src = url;
  });
}

export function ImagePicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handle(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setBusy(true);
    try {
      const data = await compress(file);
      if (data.length > MAX_CHARS) {
        toast.error("Image is too large. Try a smaller one.");
      } else {
        onChange(data);
      }
    } catch {
      toast.error("Could not read this image.");
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div className="relative w-fit overflow-hidden rounded-xl border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Attachment preview" className="max-h-48 max-w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove image"
          className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]); }}
      className={`rounded-xl border-2 border-dashed p-5 text-center transition ${
        drag ? "border-primary bg-accent" : "hover:bg-accent/50"
      }`}
    >
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Attach an image"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center gap-1 text-sm text-muted-foreground"
      >
        <ImagePlus className="size-7 text-primary" />
        <span className="font-medium text-foreground">{busy ? "Preparing image..." : "Add a photo (optional)"}</span>
        <span className="text-xs">Tap to choose, or drag and drop. It is shrunk automatically.</span>
      </button>
    </div>
  );
}