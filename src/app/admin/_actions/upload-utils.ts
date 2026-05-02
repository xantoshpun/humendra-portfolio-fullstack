import { randomUUID } from "crypto";

export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number];

const MIME_TO_EXT: Record<AllowedMime, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function randomFilename(_originalName: string, mime: string): string {
  if (!ALLOWED_MIME_TYPES.includes(mime as AllowedMime)) {
    throw new Error("Unsupported file type");
  }
  const ext = MIME_TO_EXT[mime as AllowedMime];
  return `${randomUUID()}.${ext}`;
}
