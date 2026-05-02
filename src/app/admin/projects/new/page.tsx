import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div className="px-8 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">New project</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Saved as draft until you set a publish date.
        </p>
      </header>
      <ProjectForm
        mode={{ kind: "create" }}
        initial={{
          slug: "",
          title: "",
          summary: "",
          body: "",
          thumbnailUrl: null,
          techTags: [],
          liveUrl: null,
          repoUrl: null,
          featured: false,
          publishedAt: null,
          order: 0,
        }}
      />
    </div>
  );
}
