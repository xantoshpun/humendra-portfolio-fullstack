import { getAbout } from "@/lib/content";

interface AboutCard {
  icon: keyof typeof iconMap;
  title: string;
  sub: string;
}

const iconMap = {
  degree: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  work: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  location: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  focus: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
} as const;

/**
 * About section — mirrors `portfolio/src/components/About.astro`.
 * Paragraphs may contain inline `<strong>` tags from the seeded source data,
 * so we use `dangerouslySetInnerHTML` (acceptable since the data is ours;
 * Plan 2 will sanitize once admin can edit).
 */
export async function About() {
  const about = await getAbout();
  if (!about) return null;
  const cards = (about.cards as unknown as AboutCard[]) ?? [];
  const passion = about.terminalPassion;

  return (
    <section id="about">
      <div className="container">
        <div className="section-label fade-left">about me</div>
        <h2 className="section-title fade-up">
          Know Who I{" "}
          <span className="shimmer-ready" style={{ color: "var(--cyan)" }}>
            Am
          </span>
        </h2>

        <div className="about-grid fade-up">
          <div className="about-left">
            <div className="about-text">
              {about.paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>

            <div className="terminal-card">
              <div className="terminal-bar">
                <span className="t-dot red"></span>
                <span className="t-dot amber"></span>
                <span className="t-dot green"></span>
              </div>
              <div className="terminal-body">
                <div>
                  <span className="t-prompt">$</span>{" "}
                  <span className="t-cmd">cat humendra.json</span>
                </div>
                <div className="t-json">
                  <span className="t-brace">{"{"}</span>
                  {passion && (
                    <div>
                      &nbsp;&nbsp;<span className="t-key">&quot;passion&quot;</span>
                      <span className="t-colon">: </span>
                      <span className="t-val">{passion}</span>
                    </div>
                  )}
                  <span className="t-brace">{"}"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cards-grid stagger-children">
            {cards.map((card) => (
              <div key={card.title} className="info-card">
                <span className="card-icon">{iconMap[card.icon]}</span>
                <div className="card-title">{card.title}</div>
                <div className="card-sub">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
