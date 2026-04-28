import { getStats } from "@/lib/content";
import { StatsCounter } from "./StatsCounter";

/**
 * Stats section — mirrors `portfolio/src/components/Stats.astro` verbatim.
 * The counter animation is delegated to the small client component
 * `StatsCounter` (matches the inline `<script>` in the Astro source).
 */
export async function Stats() {
  const items = await getStats();
  return (
    <section id="stats" aria-label="Key metrics">
      <div className="container">
        <div className="stats-grid stagger-children">
          {items.map((s) => (
            <div key={s.id} className={`stat-card accent-${s.accent}`}>
              <div className={`stat-num accent-${s.accent}`}>
                <StatsCounter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  display={s.display}
                />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
