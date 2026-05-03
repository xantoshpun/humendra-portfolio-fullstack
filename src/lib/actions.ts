import { revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export function zodToFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !out[path]) out[path] = issue.message;
  }
  return out;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }
  return session;
}

export function revalidate(tag: string) {
  revalidateTag(tag);
}

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; errors: Record<string, string>; message?: string };
