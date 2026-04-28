"use client";

import { useEffect, useRef } from "react";

interface StatsCounterProps {
  value: number;
  prefix?: string | null;
  suffix?: string | null;
  display: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counter with the same count-up animation as the inline script in
 * `portfolio/src/components/Stats.astro`. Skips the count-up for non-numeric
 * displays like "10K+" or non-finite values.
 */
export function StatsCounter({ value, prefix, suffix, display }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = Math.round(value);
    if (!Number.isFinite(target) || display.includes("K")) {
      el.textContent = display;
      return;
    }

    let raf: number | undefined;
    let observer: IntersectionObserver | undefined;
    const animate = () => {
      const duration = 1200;
      const start = performance.now();
      const step = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(easeOut(progress) * target);
        el.textContent = `${prefix ?? ""}${current}${suffix ?? ""}`;
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animate();
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [value, prefix, suffix, display]);

  return <span ref={ref} className="stat-counter">{display}</span>;
}
