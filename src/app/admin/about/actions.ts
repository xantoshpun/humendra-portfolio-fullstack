"use server";

import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  revalidate,
  zodToFieldErrors,
  type ActionResult,
} from "@/lib/actions";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { AboutSchema, type AboutInput } from "@/lib/schemas";

export async function updateAbout(
  id: string,
  input: AboutInput
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = AboutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: zodToFieldErrors(parsed.error),
      message: "Validation failed",
    };
  }

  await prisma.about.update({
    where: { id },
    data: parsed.data,
  });

  revalidate(CACHE_TAGS.about);
  return { ok: true };
}
