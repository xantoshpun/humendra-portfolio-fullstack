import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import {
  resolveSourceDir,
  loadJson,
  loadProjectMarkdown,
  type ProjectMd,
} from "../scripts/seed/load-source";
import {
  mapMeta,
  mapAbout,
  mapSkills,
  mapEducation,
  mapExperience,
  mapCertifications,
  mapStats,
  mapProjects,
  type RawMeta,
  type RawAbout,
  type RawSkill,
  type RawEducation,
  type RawExperience,
  type RawCertification,
  type RawStat,
} from "../scripts/seed/mappers";

const SOURCE =
  process.env.SEED_SOURCE_DIR ?? path.resolve(__dirname, "../../portfolio");

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  const root = resolveSourceDir(SOURCE);
  const dataDir = path.join(root, "src/data");
  const projectsDir = path.join(root, "src/content/projects");

  console.log(`Seeding from ${root}`);

  const meta = loadJson<RawMeta>(path.join(dataDir, "meta.json"));
  const about = loadJson<RawAbout>(path.join(dataDir, "about.json"));
  const skills = loadJson<RawSkill[]>(path.join(dataDir, "skills.json"));
  const education = loadJson<RawEducation[]>(path.join(dataDir, "education.json"));
  const experience = loadJson<RawExperience[]>(path.join(dataDir, "experience.json"));
  const certifications = loadJson<RawCertification[]>(path.join(dataDir, "certifications.json"));
  const stats = loadJson<RawStat[]>(path.join(dataDir, "stats.json"));
  const projects: ProjectMd[] = loadProjectMarkdown(projectsDir);

  // Idempotent reset of content tables (safe — auth tables untouched)
  await prisma.$transaction([
    prisma.project.deleteMany(),
    prisma.stat.deleteMany(),
    prisma.certification.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.education.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.about.deleteMany(),
    prisma.siteMeta.deleteMany(),
  ]);

  await prisma.siteMeta.create({ data: mapMeta(meta) });
  await prisma.about.create({ data: mapAbout(about) });
  await prisma.skill.createMany({ data: mapSkills(skills) });
  await prisma.education.createMany({ data: mapEducation(education) });
  await prisma.experience.createMany({ data: mapExperience(experience) });
  await prisma.certification.createMany({ data: mapCertifications(certifications) });
  await prisma.stat.createMany({ data: mapStats(stats) });
  if (projects.length > 0) {
    await prisma.project.createMany({ data: mapProjects(projects) });
  }

  console.log(
    `✔ Seeded: 1 SiteMeta, 1 About, ${skills.length} Skill, ${education.length} Education, ${experience.length} Experience, ${certifications.length} Certification, ${stats.length} Stat, ${projects.length} Project.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
