"use client";

import { useRef, type ReactNode } from "react";

/**
 * 3D holographic tilt card — ported verbatim from the inline script in
 * `portfolio/src/components/Hero.astro`. Tilts based on mouse position and
 * resets on mouse leave.
 */
export function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 15;
    const rotY = ((x - centerX) / centerX) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
    card.style.boxShadow =
      "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(25,230,206,0.2)";
  };

  const onMouseEnter = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";
  };

  const onMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    card.style.boxShadow = "none";
    card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
  };

  return (
    <div
      ref={ref}
      id="tilt-card"
      className="hero-avatar tilt-card"
      aria-hidden="true"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
}
