import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { CACHE_TAGS, projectTag } from "./cache-tags";

export { CACHE_TAGS, projectTag };

export const getSiteMeta = unstable_cache(
  () => prisma.siteMeta.findFirst(),
  ["meta"],
  { tags: [CACHE_TAGS.meta] }
);

export const getAbout = unstable_cache(
  () => prisma.about.findFirst(),
  ["about"],
  { tags: [CACHE_TAGS.about] }
);

export const getSkills = unstable_cache(
  () => prisma.skill.findMany({ orderBy: { order: "asc" } }),
  ["skills"],
  { tags: [CACHE_TAGS.skills] }
);

export const getEducation = unstable_cache(
  () => prisma.education.findMany({ orderBy: { order: "asc" } }),
  ["education"],
  { tags: [CACHE_TAGS.education] }
);

export const getExperience = unstable_cache(
  () => prisma.experience.findMany({ orderBy: { order: "asc" } }),
  ["experience"],
  { tags: [CACHE_TAGS.experience] }
);

export const getCertifications = unstable_cache(
  () => prisma.certification.findMany({ orderBy: { order: "asc" } }),
  ["certifications"],
  { tags: [CACHE_TAGS.certifications] }
);

export const getStats = unstable_cache(
  () => prisma.stat.findMany({ orderBy: { order: "asc" } }),
  ["stats"],
  { tags: [CACHE_TAGS.stats] }
);

export const getPublishedProjects = unstable_cache(
  () =>
    prisma.project.findMany({
      where: { publishedAt: { not: null, lte: new Date() } },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    }),
  ["projects"],
  { tags: [CACHE_TAGS.projects] }
);

export function getProjectBySlug(slug: string) {
  return unstable_cache(
    () =>
      prisma.project.findFirst({
        where: { slug, publishedAt: { not: null, lte: new Date() } },
      }),
    [`project-${slug}`],
    { tags: [CACHE_TAGS.projects, projectTag(slug)] }
  )();
}
