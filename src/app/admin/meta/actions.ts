"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, revalidate, type ActionResult } from "@/lib/actions";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { SiteMetaSchema, type SiteMetaInput } from "@/lib/schemas";

export async function updateSiteMeta(
  id: string,
  input: SiteMetaInput
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = SiteMetaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: zodToFieldErrors(parsed.error),
      message: "Validation failed",
    };
  }

  await prisma.siteMeta.update({
    where: { id },
    data: parsed.data,
  });

  revalidate(CACHE_TAGS.meta);
  return { ok: true };
}

function zodToFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (path && !out[path]) out[path] = issue.message;
  }
  return out;
}
