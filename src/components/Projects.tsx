import Link from "next/link";
import { getPublishedProjects } from "@/lib/content";

export async function Projects() {
  const items = await getPublishedProjects();
  return (
    <section id="projects">
      <div className="container">
        <div className="section-label fade-left">projects</div>
        <h2 className="section-title fade-up">
          Featured{" "}
          <span className="shimmer-ready" style={{ color: "var(--cyan)" }}>Work</span>
        </h2>
        <p className="section-sub fade-up">
          Selected projects showcasing my data analysis and visualisation expertise.
          Click any card to see the full case study.
        </p>

        <div className="projects-grid stagger-children">
          {items.map((p) => (
            <Link key={p.id} href={`/projects/${p.slug}`} className="project-card">
              <div className="proj-header">
                <div className="proj-open-hint">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  View case study
                </div>
              </div>

              <div className="proj-body">
                <div className="proj-title">{p.title}</div>
                <p className="proj-summary">{p.summary}</p>
              </div>

              <div className="proj-tools">
                {p.techTags.map((t) => (
                  <span key={t} className="tool-tag">{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
