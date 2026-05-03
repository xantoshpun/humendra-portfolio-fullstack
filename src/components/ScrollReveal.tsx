"use client";
import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<Element>(
      ".fade-up, .fade-left, .stagger-children, .shimmer-ready"
    );
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
