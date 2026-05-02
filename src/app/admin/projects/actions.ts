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
import { projectTag } from "@/lib/cache-tags";
import { ProjectSchema, type ProjectInput } from "@/lib/schemas";

export async function createProject(input: ProjectInput): Promise<ActionResult<{ id: string; slug: string }>> {
  await requireAdmin();
  const parsed = ProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.project.aggregate({ _max: { order: true } });
  const row = await prisma.project.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.projects);
  return { ok: true, data: { id: row.id, slug: row.slug } };
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = ProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const row = await prisma.project.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.projects);
  revalidate(projectTag(row.slug));
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    const row = await prisma.project.delete({ where: { id } });
    revalidate(CACHE_TAGS.projects);
    revalidate(projectTag(row.slug));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Project not found" };
    }
    throw e;
  }
  return { ok: true };
}

export async function publishProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const row = await prisma.project.update({
    where: { id },
    data: { publishedAt: new Date() },
  });
  revalidate(CACHE_TAGS.projects);
  revalidate(projectTag(row.slug));
  return { ok: true };
}

export async function unpublishProject(id: string): Promise<ActionResult> {
  await requireAdmin();
  const row = await prisma.project.update({
    where: { id },
    data: { publishedAt: null },
  });
  revalidate(CACHE_TAGS.projects);
  revalidate(projectTag(row.slug));
  return { ok: true };
}

export async function reorderProjects(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.project.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.projects);
  return { ok: true };
}
