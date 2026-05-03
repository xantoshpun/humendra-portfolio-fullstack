import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "../experience-form";


export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await prisma.experience.findUnique({ where: { id } });
  if (!exp) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit experience</h1>
        <p className="text-sm text-muted-foreground mt-1">{exp.role}</p>
      </header>
      <ExperienceForm
        mode={{ kind: "edit", id: exp.id }}
        initial={{
          role: exp.role,
          company: exp.company,
          date: exp.date,
          badgeText: exp.badgeText,
          badgeColor: exp.badgeColor as "cyan" | "green" | "purple" | null,
          skills: exp.skills,
          order: exp.order,
        }}
      />
    </div>
  );
}
