import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { StatsList } from "./stats-list";


export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const rows = await prisma.stat.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. These appear as highlight cards on the home page.
          </p>
        </div>
        <Link href="/admin/stats/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New stat
        </Link>
      </header>

      <StatsList
        items={rows.map((r) => ({
          id: r.id,
          display: r.display,
          label: r.label,
          accent: r.accent,
        }))}
      />
    </div>
  );
}
