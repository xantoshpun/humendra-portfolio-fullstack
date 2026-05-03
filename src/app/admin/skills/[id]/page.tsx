import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "../skill-form";


export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit skill</h1>
        <p className="text-sm text-muted-foreground mt-1">{skill.title}</p>
      </header>
      <SkillForm
        mode={{ kind: "edit", id: skill.id }}
        initial={{
          icon: skill.icon,
          title: skill.title,
          color: skill.color as "cyan" | "purple" | "green",
          tags: skill.tags,
          order: skill.order,
        }}
      />
    </div>
  );
}
