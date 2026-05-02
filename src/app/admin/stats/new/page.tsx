import { StatForm } from "../stat-form";

export default function NewStatPage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New stat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Will appear at the end of the Stats section.
        </p>
      </header>
      <StatForm
        mode={{ kind: "create" }}
        initial={{
          value: 0,
          prefix: null,
          suffix: null,
          display: "",
          label: "",
          accent: "cyan",
          order: 0,
        }}
      />
    </div>
  );
}
