import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "../project-form";

export const dynamic = "force-dynamic";


export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit project</h1>
        <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
      </header>
      <ProjectForm
        mode={{ kind: "edit", id: project.id }}
        initial={{
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          body: project.body,
          thumbnailUrl: project.thumbnailUrl,
          techTags: project.techTags,
          liveUrl: project.liveUrl,
          repoUrl: project.repoUrl,
          featured: project.featured,
          publishedAt: project.publishedAt,
          order: project.order,
        }}
      />
    </div>
  );
}
