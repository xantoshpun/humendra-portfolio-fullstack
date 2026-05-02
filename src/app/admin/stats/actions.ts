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
import { StatSchema, type StatInput } from "@/lib/schemas";

export async function createStat(input: StatInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = StatSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.stat.aggregate({ _max: { order: true } });
  const row = await prisma.stat.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.stats);
  return { ok: true, data: { id: row.id } };
}

export async function updateStat(id: string, input: StatInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = StatSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  await prisma.stat.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.stats);
  return { ok: true };
}

export async function deleteStat(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.stat.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Stat not found" };
    }
    throw e;
  }
  revalidate(CACHE_TAGS.stats);
  return { ok: true };
}

export async function reorderStats(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.stat.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.stats);
  return { ok: true };
}
