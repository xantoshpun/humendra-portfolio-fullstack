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
import { CertificationSchema, type CertificationInput } from "@/lib/schemas";

export async function createCertification(input: CertificationInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const parsed = CertificationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  const max = await prisma.certification.aggregate({ _max: { order: true } });
  const row = await prisma.certification.create({
    data: { ...parsed.data, order: (max._max.order ?? -1) + 1 },
  });
  revalidate(CACHE_TAGS.certifications);
  return { ok: true, data: { id: row.id } };
}

export async function updateCertification(id: string, input: CertificationInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = CertificationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: zodToFieldErrors(parsed.error), message: "Validation failed" };
  }
  await prisma.certification.update({ where: { id }, data: parsed.data });
  revalidate(CACHE_TAGS.certifications);
  return { ok: true };
}

export async function deleteCertification(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.certification.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return { ok: false, errors: {}, message: "Certification not found" };
    }
    throw e;
  }
  revalidate(CACHE_TAGS.certifications);
  return { ok: true };
}

export async function reorderCertifications(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, idx) =>
      prisma.certification.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidate(CACHE_TAGS.certifications);
  return { ok: true };
}
