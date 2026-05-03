import Link from "next/link";
import {
  Settings,
  User,
  Sparkles,
  GraduationCap,
  Briefcase,
  Award,
  BarChart3,
  FolderKanban,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


async function loadCounts() {
  const [
    skills,
    education,
    experience,
    certifications,
    stats,
    projects,
    drafts,
    siteMeta,
    about,
  ] = await Promise.all([
    prisma.skill.count(),
    prisma.education.count(),
    prisma.experience.count(),
    prisma.certification.count(),
    prisma.stat.count(),
    prisma.project.count(),
    prisma.project.count({ where: { publishedAt: null } }),
    prisma.siteMeta.findFirst({ select: { id: true, updatedAt: true } }),
    prisma.about.findFirst({ select: { id: true, updatedAt: true } }),
  ]);
  return {
    skills,
    education,
    experience,
    certifications,
    stats,
    projects,
    drafts,
    metaUpdated: siteMeta?.updatedAt,
    aboutUpdated: about?.updatedAt,
  };
}

const tiles = [
  { href: "/admin/meta", label: "Site meta", icon: Settings, key: "meta" as const },
  { href: "/admin/about", label: "About", icon: User, key: "about" as const },
  { href: "/admin/skills", label: "Skills", icon: Sparkles, key: "skills" as const },
  { href: "/admin/education", label: "Education", icon: GraduationCap, key: "education" as const },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, key: "experience" as const },
  { href: "/admin/certifications", label: "Certifications", icon: Award, key: "certifications" as const },
  { href: "/admin/stats", label: "Stats", icon: BarChart3, key: "stats" as const },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, key: "projects" as const },
];

export default async function AdminHome() {
  const counts = await loadCounts();

  function tileValue(key: (typeof tiles)[number]["key"]) {
    if (key === "meta") return counts.metaUpdated ? "Configured" : "Not set";
    if (key === "about") return counts.aboutUpdated ? "Configured" : "Not set";
    if (key === "projects") {
      return counts.drafts > 0
        ? `${counts.projects} (${counts.drafts} draft${counts.drafts === 1 ? "" : "s"})`
        : `${counts.projects}`;
    }
    return String(counts[key]);
  }

  return (
    <div className="px-8 py-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Edit any section below. Changes go live within seconds via ISR cache invalidation.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map(({ href, label, icon: Icon, key }) => (
          <Link key={href} href={href} className="group">
            <Card className="hover:border-primary/40 transition-colors h-full">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{tileValue(key)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
