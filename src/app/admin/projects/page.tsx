import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { ProjectsList } from "./projects-list";


export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const rows = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. Use Publish / Unpublish to control visibility.
          </p>
        </div>
        <Link href="/admin/projects/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New project
        </Link>
      </header>

      <ProjectsList
        items={rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          publishedAt: r.publishedAt,
          featured: r.featured,
        }))}
      />
    </div>
  );
}
