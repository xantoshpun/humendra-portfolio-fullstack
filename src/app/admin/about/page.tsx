import { prisma } from "@/lib/prisma";
import { AboutForm } from "./about-form";
import type { AboutInput } from "@/lib/schemas";


export default async function AboutPage() {
  const row = await prisma.about.findFirst();
  if (!row) {
    return (
      <div className="px-8 py-6">
        <h1 className="text-2xl font-semibold">About</h1>
        <p className="text-sm text-muted-foreground mt-2">
          No About row exists. Run the seed script to bootstrap content.
        </p>
      </div>
    );
  }

  const cards = (row.cards ?? []) as AboutInput["cards"];

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paragraphs (HTML allowed for inline emphasis), info cards, and the
          terminal-passion snippet.
        </p>
      </header>
      <AboutForm
        initial={{
          id: row.id,
          paragraphs: row.paragraphs,
          cards,
          terminalPassion: row.terminalPassion,
        }}
      />
    </div>
  );
}
