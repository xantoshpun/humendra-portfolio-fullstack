"use server";

import { requireAdmin } from "@/lib/actions";
import { getSignedPutUrl } from "@/lib/r2";
import { checkRateLimit, RateLimitedError } from "@/lib/rate-limit";
import { randomFilename } from "./upload-utils";

const MAX_SIZE = 5_000_000;

export async function requestUploadUrl(input: {
  filename: string;
  contentType: string;
  size: number;
}): Promise<
  | { ok: true; url: string; publicUrl: string }
  | { ok: false; message: string }
> {
  const session = await requireAdmin();

  try {
    checkRateLimit(session.user!.id!, "upload");
  } catch (e) {
    if (e instanceof RateLimitedError) {
      return { ok: false, message: "Upload limit reached — try again in an hour" };
    }
    throw e;
  }

  if (input.size > MAX_SIZE) {
    return { ok: false, message: "File exceeds 5 MB limit" };
  }

  let key: string;
  try {
    key = randomFilename(input.filename, input.contentType);
  } catch {
    return { ok: false, message: "Unsupported file type" };
  }

  const url = await getSignedPutUrl(key, input.contentType);
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return { ok: true, url, publicUrl };
}
