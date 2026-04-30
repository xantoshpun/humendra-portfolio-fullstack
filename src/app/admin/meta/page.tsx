import { prisma } from "@/lib/prisma";
import { SiteMetaForm } from "./site-meta-form";

export const dynamic = "force-dynamic";

export default async function SiteMetaPage() {
  const row = await prisma.siteMeta.findFirst();
  if (!row) {
    return (
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold">Site meta</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No site meta row exists. Run the seed script to bootstrap content.
        </p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Site meta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Name, location, hero bio, typewriter titles, and social links.
        </p>
      </header>
      <SiteMetaForm
        initial={{
          id: row.id,
          name: row.name,
          initials: row.initials,
          location: row.location,
          email: row.email,
          heroBio: row.heroBio,
          titles: row.titles,
          socials: (row.socials ?? {}) as Record<string, string>,
        }}
      />
    </div>
  );
}
