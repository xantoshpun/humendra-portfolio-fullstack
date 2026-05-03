import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="project-detail container">
      <div className="project-detail-header">
        <Link href="/#projects" className="back-link">← Back to projects</Link>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">{project.summary}</p>
        <div className="proj-tools" style={{ marginBottom: "1.5rem" }}>
          {project.techTags.map((t) => (
            <span key={t} className="tool-tag">{t}</span>
          ))}
        </div>
        {(project.liveUrl || project.repoUrl) && (
          <div className="project-detail-links">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Live Demo
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
      <div className="project-body markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.body ?? ""}</ReactMarkdown>
      </div>
    </article>
  );
}
