import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { SkillsList } from "./skills-list";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. Order on the public page matches the order here.
          </p>
        </div>
        <Link href="/admin/skills/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New skill
        </Link>
      </header>

      <SkillsList items={skills} />
    </div>
  );
}
