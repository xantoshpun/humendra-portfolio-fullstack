import { ExperienceForm } from "../experience-form";

export default function NewExperiencePage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New experience entry</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Will appear at the end of the Experience section.
        </p>
      </header>
      <ExperienceForm
        mode={{ kind: "create" }}
        initial={{
          role: "",
          company: "",
          date: "",
          badgeText: null,
          badgeColor: null,
          skills: [],
          order: 0,
        }}
      />
    </div>
  );
}
