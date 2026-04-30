"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  requireAdmin,
  revalidate,
  zodToFieldErrors,
  type ActionResult,
} from "@/lib/actions";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { SkillSchema, type SkillInput } from "@/lib/schemas";

export async function createSkill(input: SkillInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = SkillSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.skill.aggregate({ _max: { order: true } });
  const skill = await prisma.skill.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.skills);
  return { ok: true, data: { id: skill.id } };
}

export async function createSkillAndRedirect(input: SkillInput) {
  const res = await createSkill(input);
  if (res.ok) redirect("/admin/skills");
  return res;
}

export async function updateSkill(id: string, input: SkillInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = SkillSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  await prisma.skill.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.skills);
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.skill.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Skill not found" };
    }
    throw e;
  }
  revalidate(CACHE_TAGS.skills);
  return { ok: true };
}

export async function reorderSkills(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.skill.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.skills);
  return { ok: true };
}
