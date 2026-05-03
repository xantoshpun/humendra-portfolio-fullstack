import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatForm } from "../stat-form";

export const dynamic = "force-dynamic";


export default async function EditStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await prisma.stat.findUnique({ where: { id } });
  if (!stat) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit stat</h1>
        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
      </header>
      <StatForm
        mode={{ kind: "edit", id: stat.id }}
        initial={{
          value: stat.value,
          prefix: stat.prefix,
          suffix: stat.suffix,
          display: stat.display,
          label: stat.label,
          accent: stat.accent as "cyan" | "purple" | "green" | "amber",
          order: stat.order,
        }}
      />
    </div>
  );
}
