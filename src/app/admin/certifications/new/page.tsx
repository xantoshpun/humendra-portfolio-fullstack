import { CertificationForm } from "../certification-form";

export default function NewCertificationPage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New certification</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Will appear at the end of the Certifications section.
        </p>
      </header>
      <CertificationForm
        mode={{ kind: "create" }}
        initial={{
          img: null,
          name: "",
          issuer: "",
          date: "",
          order: 0,
        }}
      />
    </div>
  );
}
