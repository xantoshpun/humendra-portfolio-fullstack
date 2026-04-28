"use client";
import { useState } from "react";

interface CertAccordionProps {
  children: React.ReactNode;
}

export function CertAccordion({ children }: CertAccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cert-accordion fade-up">
      <button
        className="cert-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cert-toggle-left">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
          Certifications
        </span>
        <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <div className={`cert-body${open ? " open" : ""}`}>
        {children}
      </div>
    </div>
  );
}
