export const CACHE_TAGS = {
  meta: "meta",
  about: "about",
  skills: "skills",
  education: "education",
  experience: "experience",
  certifications: "certifications",
  stats: "stats",
  projects: "projects",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export const projectTag = (slug: string) => `project:${slug}`;
