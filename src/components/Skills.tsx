import { getSkills } from "@/lib/content";

const iconBg: Record<string, string> = {
  cyan: "rgba(0,212,255,0.1)",
  purple: "rgba(124,58,237,0.1)",
  green: "rgba(16,185,129,0.1)",
};

/**
 * Skills section — mirrors `portfolio/src/components/Skills.astro` verbatim.
 */
export async function Skills() {
  const skills = await getSkills();
  return (
    <section id="skills">
      <div className="container">
        <div className="section-label fade-left">skills</div>
        <h2 className="section-title fade-up">
          My{" "}
          <span className="shimmer-ready" style={{ color: "var(--cyan)" }}>
            Tech Stack
          </span>
        </h2>
        <p className="section-sub fade-up">
          Tools and technologies I use to extract insights from data and build intelligent solutions.
        </p>

        <div className="skills-grid stagger-children">
          {skills.map((s) => (
            <div key={s.id} className="skill-card">
              <div className="skill-card-head">
                <div
                  className="skill-icon"
                  style={{ background: iconBg[s.color] }}
                >
                  {s.icon}
                </div>
                <div className="skill-title">{s.title}</div>
              </div>
              <div className="skill-tags">
                {s.tags.map((t) => (
                  <span key={t} className={`tag ${s.color}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
