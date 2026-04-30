import { z } from "zod";

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .transform((v) => (v === "" ? null : v))
  .nullable();

const colorEnum = z.enum(["cyan", "purple", "green"]);
const honourColorEnum = z.enum(["cyan", "amber", "green", "purple"]);
const accentEnum = z.enum(["cyan", "purple", "green", "amber"]);

export const SiteMetaSchema = z.object({
  name: z.string().min(1),
  initials: z.string().min(1),
  location: z.string().min(1),
  email: z.string().email(),
  heroBio: z.string().min(1),
  titles: z.array(z.string()),
  socials: z.record(z.string(), z.string().url()),
});
export type SiteMetaInput = z.infer<typeof SiteMetaSchema>;

export const AboutCardSchema = z.object({
  icon: z.string(),
  title: z.string(),
  sub: z.string(),
});

export const AboutSchema = z.object({
  paragraphs: z.array(z.string()),
  cards: z.array(AboutCardSchema),
  terminalPassion: z.string().nullable(),
});
export type AboutInput = z.infer<typeof AboutSchema>;

export const SkillSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  color: colorEnum,
  tags: z.array(z.string()),
  order: z.number().int().nonnegative(),
});
export type SkillInput = z.infer<typeof SkillSchema>;

export const EducationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  date: z.string().min(1),
  honour: z.string().nullable(),
  honourColor: honourColorEnum.nullable(),
  focus: z.array(z.string()),
  order: z.number().int().nonnegative(),
});
export type EducationInput = z.infer<typeof EducationSchema>;

export const ExperienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  date: z.string().min(1),
  badgeColor: colorEnum.nullable(),
  badgeText: z.string().nullable(),
  skills: z.array(z.string()),
  order: z.number().int().nonnegative(),
});
export type ExperienceInput = z.infer<typeof ExperienceSchema>;

export const CertificationSchema = z.object({
  img: z.string().nullable(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().min(1),
  order: z.number().int().nonnegative(),
});
export type CertificationInput = z.infer<typeof CertificationSchema>;

export const StatSchema = z.object({
  value: z.number(),
  prefix: z.string().nullable(),
  suffix: z.string().nullable(),
  display: z.string().min(1),
  label: z.string().min(1),
  accent: accentEnum,
  order: z.number().int().nonnegative(),
});
export type StatInput = z.infer<typeof StatSchema>;

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ProjectSchema = z.object({
  slug: z.string().min(1).regex(slugRegex, "Use lowercase letters, numbers, and hyphens"),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string(),
  thumbnailUrl: optionalUrl,
  techTags: z.array(z.string()),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  order: z.number().int().nonnegative(),
  featured: z.boolean(),
  publishedAt: z
    .union([z.date(), z.string().datetime(), z.null()])
    .transform((v) => (typeof v === "string" ? new Date(v) : v)),
});
export type ProjectInput = z.infer<typeof ProjectSchema>;
