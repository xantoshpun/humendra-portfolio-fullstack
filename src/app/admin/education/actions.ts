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
import { EducationSchema, type EducationInput } from "@/lib/schemas";

export async function createEducation(input: EducationInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = EducationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.education.aggregate({ _max: { order: true } });
  const row = await prisma.education.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.education);
  return { ok: true, data: { id: row.id } };
}

export async function updateEducation(id: string, input: EducationInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = EducationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  await prisma.education.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.education);
  return { ok: true };
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.education.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Education entry not found" };
    }
    throw e;
  }
  revalidate(CACHE_TAGS.education);
  return { ok: true };
}

export async function reorderEducation(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.education.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.education);
  return { ok: true };
}
