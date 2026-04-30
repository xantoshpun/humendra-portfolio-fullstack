import { revalidateTag } from "next/cache";
import { auth } from "@/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new UnauthorizedError();
  }
  return session;
}

export function revalidate(tag: string) {
  revalidateTag(tag, "max");
}

export type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; errors: Record<string, string>; message?: string };
