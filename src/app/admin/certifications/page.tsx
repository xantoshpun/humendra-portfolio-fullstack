import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { CertificationsList } from "./certifications-list";


export default async function CertificationsPage() {
  const rows = await prisma.certification.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-8 py-6">
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Certifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag to reorder. Newer entries usually come first.
          </p>
        </div>
        <Link href="/admin/certifications/new" className={buttonVariants()}>
          <Plus className="size-4" />
          New entry
        </Link>
      </header>

      <CertificationsList
        items={rows.map((r) => ({
          id: r.id,
          name: r.name,
          issuer: r.issuer,
          date: r.date,
        }))}
      />
    </div>
  );
}
