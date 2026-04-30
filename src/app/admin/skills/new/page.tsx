import { SkillForm } from "../skill-form";

export default function NewSkillPage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New skill</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Will appear at the end of the public Skills section.
        </p>
      </header>
      <SkillForm
        mode={{ kind: "create" }}
        initial={{
          icon: "",
          title: "",
          color: "cyan",
          tags: [],
          order: 0,
        }}
      />
    </div>
  );
}
