import { MAX_IMAGE_BYTES } from "@/lib/validations/complaint";

// WHY: we do NOT trust the browser's file type. We read the first bytes
// ("magic bytes") to know the real type.
function detectMime(b: Buffer): string | null {
  if (b.length > 12 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function toSafeDataUrl(
  file: File
): Promise<{ dataUrl: string } | { error: string }> {
  if (file.size > MAX_IMAGE_BYTES) return { error: "Image must be 300 KB or smaller." };
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = detectMime(bytes);
  if (!mime) return { error: "Only PNG, JPG or WebP images are allowed." };
  // WHY: the data URL is built by us from a checked type, never from user text.
  return { dataUrl: `data:${mime};base64,${bytes.toString("base64")}` };
}