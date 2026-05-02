import { EducationForm } from "../education-form";

export default function NewEducationPage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New education entry</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Will appear at the end of the Education section.
        </p>
      </header>
      <EducationForm
        mode={{ kind: "create" }}
        initial={{
          degree: "",
          institution: "",
          date: "",
          honour: null,
          honourColor: null,
          focus: [],
          order: 0,
        }}
      />
    </div>
  );
}
