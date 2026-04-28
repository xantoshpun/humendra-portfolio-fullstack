import type { Prisma } from "@prisma/client";
import type { ProjectMd } from "./load-source";

export interface RawMeta {
  name: string;
  initials: string;
  location: string;
  email: string;
  titles: string[];
  heroBio: string;
  social: Record<string, string>;
}
export function mapMeta(m: RawMeta): Prisma.SiteMetaCreateInput {
  return {
    name: m.name,
    initials: m.initials,
    location: m.location,
    email: m.email,
    titles: m.titles,
    heroBio: m.heroBio,
    socials: m.social,
  };
}

export interface RawAbout {
  paragraphs: string[];
  cards: Array<{ icon: string; title: string; sub: string }>;
  terminal?: { passion?: string };
}
export function mapAbout(a: RawAbout): Prisma.AboutCreateInput {
  return {
    paragraphs: a.paragraphs,
    cards: a.cards,
    terminalPassion: a.terminal?.passion ?? null,
  };
}

export interface RawSkill {
  icon: string;
  title: string;
  color: string;
  tags: string[];
}
export function mapSkills(skills: RawSkill[]): Prisma.SkillCreateManyInput[] {
  return skills.map((s, i) => ({ ...s, order: i }));
}

export interface RawEducation {
  degree: string;
  institution: string;
  date: string;
  honour?: string;
  honourColor?: string;
  focus: string[];
}
export function mapEducation(items: RawEducation[]): Prisma.EducationCreateManyInput[] {
  return items.map((e, i) => ({
    degree: e.degree,
    institution: e.institution,
    date: e.date,
    honour: e.honour ?? null,
    honourColor: e.honourColor ?? null,
    focus: e.focus,
    order: i,
  }));
}

export interface RawExperience {
  role: string;
  company: string;
  date: string;
  badgeColor?: string;
  badgeText?: string;
  skills: string[];
}
export function mapExperience(items: RawExperience[]): Prisma.ExperienceCreateManyInput[] {
  return items.map((e, i) => ({
    role: e.role,
    company: e.company,
    date: e.date,
    badgeColor: e.badgeColor ?? null,
    badgeText: e.badgeText ?? null,
    skills: e.skills,
    order: i,
  }));
}

export interface RawCertification {
  img?: string;
  name: string;
  issuer: string;
  date: string;
}
export function mapCertifications(items: RawCertification[]): Prisma.CertificationCreateManyInput[] {
  return items.map((c, i) => ({
    img: c.img ?? null,
    name: c.name,
    issuer: c.issuer,
    date: c.date,
    order: i,
  }));
}

export interface RawStat {
  value: number;
  prefix?: string;
  suffix?: string;
  display: string;
  label: string;
  accent: string;
}
export function mapStats(items: RawStat[]): Prisma.StatCreateManyInput[] {
  return items.map((s, i) => ({
    value: s.value,
    prefix: s.prefix ?? null,
    suffix: s.suffix ?? null,
    display: s.display,
    label: s.label,
    accent: s.accent,
    order: i,
  }));
}

export function mapProjects(items: ProjectMd[]): Prisma.ProjectCreateManyInput[] {
  return items.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    body: p.body,
    thumbnailUrl: p.thumbnailUrl ?? null,
    techTags: p.techTags ?? [],
    liveUrl: p.liveUrl ?? null,
    repoUrl: p.repoUrl ?? null,
    order: p.order ?? i,
    featured: p.featured ?? false,
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
  }));
}
