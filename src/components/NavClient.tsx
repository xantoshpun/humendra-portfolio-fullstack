"use client";

import { useEffect, useRef, useState } from "react";

interface NavClientProps {
  initials: string;
  resumeUrl: string;
}

const SECTIONS = ["about", "skills", "projects", "education", "contact"] as const;

/**
 * Client-side behaviour for the main nav. Mirrors the inline scripts in
 * `portfolio/src/components/Nav.astro`:
 *  - revealed after a short delay (matching the hero finishing)
 *  - frosted background + active-link spy on scroll
 *  - mobile hamburger toggles the dropdown menu and locks body scroll
 */
export function NavClient({ initials, resumeUrl }: NavClientProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [hidden, setHidden] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(SECTIONS[0]);

  // Reveal nav once hero has had a moment to play.
  useEffect(() => {
    const t = setTimeout(() => setHidden(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // Scroll handler: frosted glass + active link.
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 50);
      let current = "";
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      if (!current) current = SECTIONS[0];
      setActiveId(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    // Match the 150ms close-after-click delay in the Astro source.
    setTimeout(() => setMobileOpen(false), 150);
  };

  const linkClass = (id: string) => (activeId === id ? "active" : undefined);

  const navClasses = [
    hidden ? "nav-hidden" : "nav-visible",
    scrolled ? "scrolled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav id="main-nav" ref={navRef} className={navClasses}>
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <svg
            className="logo-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="4 17 10 11 4 5"></polyline>
            <line x1="12" y1="19" x2="20" y2="19"></line>
          </svg>
          <span>{initials}</span>
        </a>

        <ul className="nav-links hide-mobile">
          <li>
            <a href="/#about" className={linkClass("about")}>
              About
            </a>
          </li>
          <li>
            <a href="/#skills" className={linkClass("skills")}>
              Skills
            </a>
          </li>
          <li>
            <a href="/#projects" className={linkClass("projects")}>
              Projects
            </a>
          </li>
          <li>
            <a href="/#education" className={linkClass("education")}>
              Education
            </a>
          </li>
          <li>
            <a href="/#contact" className={linkClass("contact")}>
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-right">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener"
            className="nav-cta hide-mobile"
          >
            Resume
          </a>
          <button
            id="mobile-toggle"
            type="button"
            className={`mobile-toggle show-mobile${mobileOpen ? " open" : ""}`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="ham-line"></span>
            <span className="ham-line"></span>
            <span className="ham-line"></span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu${mobileOpen ? " open" : ""}`}
      >
        <a href="/#about" className="mobile-link" onClick={closeMobile}>
          About
        </a>
        <a href="/#skills" className="mobile-link" onClick={closeMobile}>
          Skills
        </a>
        <a href="/#projects" className="mobile-link" onClick={closeMobile}>
          Projects
        </a>
        <a href="/#education" className="mobile-link" onClick={closeMobile}>
          Education
        </a>
        <a href="/#contact" className="mobile-link" onClick={closeMobile}>
          Contact
        </a>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener"
          className="mobile-link mobile-resume"
          onClick={closeMobile}
        >
          Resume
        </a>
      </div>
    </nav>
  );
}
