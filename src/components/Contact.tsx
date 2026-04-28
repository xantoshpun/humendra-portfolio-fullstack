import { getSiteMeta } from "@/lib/content";
import { ContactForm } from "./ContactForm";

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  );
}

function KaggleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.334z"/>
    </svg>
  );
}

export async function Contact() {
  const meta = await getSiteMeta();
  if (!meta) return null;
  const socials = meta.socials as Record<string, string>;

  const links = [
    {
      href: `mailto:${meta.email}`,
      label: "Email",
      val: meta.email,
      bg: "rgba(25,230,206,0.08)",
      color: "var(--cyan)",
      icon: <EmailIcon />,
      external: false,
    },
    {
      href: socials.linkedin ?? "#",
      label: "LinkedIn",
      val: socials.linkedin ?? "",
      bg: "rgba(10,102,194,0.12)",
      color: "#5b9bd5",
      icon: <LinkedInIcon />,
      external: true,
    },
    {
      href: socials.github ?? "#",
      label: "GitHub",
      val: socials.github ?? "",
      bg: "rgba(255,255,255,0.06)",
      color: "#e2e8f0",
      icon: <GitHubIcon />,
      external: true,
    },
    {
      href: socials.kaggle ?? "#",
      label: "Kaggle",
      val: "kaggle.com/xantoshpun",
      bg: "rgba(25,230,206,0.08)",
      color: "var(--cyan)",
      icon: <KaggleIcon />,
      external: true,
    },
  ];

  return (
    <section id="contact">
      <div className="container">
        <div className="section-label fade-left">contact</div>
        <h2 className="section-title fade-up">
          Let&apos;s{" "}
          <span className="shimmer-ready" style={{ color: "var(--cyan)" }}>
            Connect
          </span>
        </h2>
        <p className="section-sub fade-up">
          Open to data analyst roles, freelance projects, and collaboration. Drop me a message.
        </p>

        <div className="contact-grid fade-up">
          {/* Info side */}
          <div>
            <h3 className="contact-info-title">Get in touch</h3>
            <p className="contact-info-text">
              I&apos;m always open to discussing data projects, collaboration opportunities,
              or just chatting about the latest in data and ML.
            </p>
            <div className="contact-links">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="contact-link"
                >
                  <div
                    className="contact-link-icon"
                    style={{ background: l.bg, color: l.color }}
                  >
                    {l.icon}
                  </div>
                  <div>
                    <div className="contact-link-label">{l.label}</div>
                    <div className="contact-link-val">{l.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="form-wrap">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
