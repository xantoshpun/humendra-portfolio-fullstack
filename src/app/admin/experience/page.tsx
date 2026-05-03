import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { ExperienceList } from "./experience-list";


export default async function ExperiencePage() {
  const rows = await prisma.experience.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. Newer entries usually come first.
          </p>
        </div>
        <Link href="/admin/experience/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New entry
        </Link>
      </header>

      <ExperienceList
        items={rows.map((r) => ({
          id: r.id,
          role: r.role,
          company: r.company,
          date: r.date,
          badgeText: r.badgeText,
        }))}
      />
    </div>
  );
}
