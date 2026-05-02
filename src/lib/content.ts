import { cacheTag, cacheLife } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS, projectTag } from "./cache-tags";

export { CACHE_TAGS, projectTag };

export async function getSiteMeta() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.meta);
  return prisma.siteMeta.findFirst();
}

export async function getAbout() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.about);
  return prisma.about.findFirst();
}

export async function getSkills() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.skills);
  return prisma.skill.findMany({ orderBy: { order: "asc" } });
}

export async function getEducation() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.education);
  return prisma.education.findMany({ orderBy: { order: "asc" } });
}

export async function getExperience() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.experience);
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function getCertifications() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.certifications);
  return prisma.certification.findMany({ orderBy: { order: "asc" } });
}

export async function getStats() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.stats);
  return prisma.stat.findMany({ orderBy: { order: "asc" } });
}

export async function getPublishedProjects() {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.projects);
  return prisma.project.findMany({
    where: { publishedAt: { not: null, lte: new Date() } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
}

export async function getProjectBySlug(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAGS.projects, projectTag(slug));
  return prisma.project.findFirst({
    where: {
      slug,
      publishedAt: { not: null, lte: new Date() },
    },
  });
}
