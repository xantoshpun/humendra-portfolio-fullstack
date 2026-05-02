import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "../education-form";

export const dynamic = "force-dynamic";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edu = await prisma.education.findUnique({ where: { id } });
  if (!edu) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit education</h1>
        <p className="text-sm text-muted-foreground mt-1">{edu.degree}</p>
      </header>
      <EducationForm
        mode={{ kind: "edit", id: edu.id }}
        initial={{
          degree: edu.degree,
          institution: edu.institution,
          date: edu.date,
          honour: edu.honour,
          honourColor: edu.honourColor as "cyan" | "amber" | "green" | "purple" | null,
          focus: edu.focus,
          order: edu.order,
        }}
      />
    </div>
  );
}
