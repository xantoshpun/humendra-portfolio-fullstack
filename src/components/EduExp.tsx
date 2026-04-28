import Image from "next/image";
import { getEducation, getExperience, getCertifications } from "@/lib/content";
import { CertAccordion } from "./CertAccordion";

export async function EduExp() {
  const [education, experience, certifications] = await Promise.all([
    getEducation(),
    getExperience(),
    getCertifications(),
  ]);

  return (
    <section id="education">
      <div className="container">
        <div className="section-label fade-left">background</div>
        <h2 className="section-title fade-up">
          Education &amp;{" "}
          <span className="shimmer-ready" style={{ color: "var(--cyan)" }}>
            Experience
          </span>
        </h2>

        <div className="edu-exp-grid fade-up">
          {/* Education column */}
          <div className="col">
            <div className="col-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              Education
            </div>
            <div className="tl">
              {education.map((e) => (
                <div key={e.id} className="tl-row">
                  <div className="tl-spine">
                    <div className="tl-bull" />
                    <div className="tl-line" />
                  </div>
                  <div className="tl-card">
                    <div className="card-top">
                      <div>
                        <div className="card-title">{e.degree}</div>
                        <div className="card-org">{e.institution}</div>
                      </div>
                      <span className="card-date">{e.date}</span>
                    </div>
                    {e.honourColor === "cyan" && (
                      <div className="honour-badge">{e.honour}</div>
                    )}
                    <div className="card-tags">
                      {e.focus.map((f) => (
                        <span key={f} className="ctag">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience column */}
          <div className="col">
            <div className="col-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              Experience
            </div>
            <div className="tl">
              {experience.map((x) => (
                <div key={x.id} className="tl-row">
                  <div className="tl-spine">
                    <div className="tl-bull" />
                    <div className="tl-line" />
                  </div>
                  <div className="tl-card">
                    <div className="card-top">
                      <div>
                        <div className="card-title">{x.role}</div>
                        <div className="card-org">{x.company}</div>
                      </div>
                      <span className="card-date">{x.date}</span>
                    </div>
                    <div className="card-tags">
                      {x.skills.map((s) => (
                        <span key={s} className="ctag">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <CertAccordion>
          <div className="cert-grid stagger-children">
            {certifications.map((c) => (
              <div key={c.id} className="cert-card">
                <div className="cert-card-icon">
                  {c.img && (
                    <Image
                      src={`/icons/${c.img}`}
                      alt={c.name}
                      width={26}
                      height={26}
                    />
                  )}
                </div>
                <div className="cert-info">
                  <div className="cert-name">{c.name}</div>
                  <div className="cert-footer">
                    <span className="cert-issuer">{c.issuer}</span>
                    <span className="cert-date">{c.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CertAccordion>
      </div>
    </section>
  );
}
