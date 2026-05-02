"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  revalidate,
  zodToFieldErrors,
  type ActionResult,
} from "@/lib/actions";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { ExperienceSchema, type ExperienceInput } from "@/lib/schemas";

export async function createExperience(input: ExperienceInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = ExperienceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.experience.aggregate({ _max: { order: true } });
  const row = await prisma.experience.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.experience);
  return { ok: true, data: { id: row.id } };
}

export async function updateExperience(id: string, input: ExperienceInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ExperienceSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  await prisma.experience.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.experience);
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.experience.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Experience entry not found" };
    }
    throw e;
  }
  revalidate(CACHE_TAGS.experience);
  return { ok: true };
}

export async function reorderExperience(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.experience.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.experience);
  return { ok: true };
}
