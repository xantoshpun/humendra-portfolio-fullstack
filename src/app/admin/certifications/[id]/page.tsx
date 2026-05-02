import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CertificationForm } from "../certification-form";

export const dynamic = "force-dynamic";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert) notFound();

  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Edit certification</h1>
        <p className="text-sm text-muted-foreground mt-1">{cert.name}</p>
      </header>
      <CertificationForm
        mode={{ kind: "edit", id: cert.id }}
        initial={{
          img: cert.img,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
          order: cert.order,
        }}
      />
    </div>
  );
}
