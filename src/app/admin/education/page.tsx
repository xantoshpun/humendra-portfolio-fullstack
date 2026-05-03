import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { EducationList } from "./education-list";


export const dynamic = "force-dynamic";

export default async function EducationPage() {
  const rows = await prisma.education.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Education</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. Newer entries usually come first.
          </p>
        </div>
        <Link href="/admin/education/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New entry
        </Link>
      </header>

      <EducationList
        items={rows.map((r) => ({
          id: r.id,
          degree: r.degree,
          institution: r.institution,
          date: r.date,
          honour: r.honour,
        }))}
      />
    </div>
  );
}
