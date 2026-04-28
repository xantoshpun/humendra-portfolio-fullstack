import { getSiteMeta } from "@/lib/content";
import { Typewriter } from "./Typewriter";
import { TiltCard } from "./TiltCard";

/**
 * Hero section — mirrors `portfolio/src/components/Hero.astro` verbatim.
 * The interactive bits (typewriter, tilt-card) are pulled out into client
 * components; everything else is rendered on the server.
 */
export async function Hero() {
  const meta = await getSiteMeta();
  if (!meta) return null;
  const titles = meta.titles ?? [];

  return (
    <>
      <section id="hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-top-row">
            <div className="hero-text-box bento-green">
              <div className="hero-hello reveal" style={{ ["--d" as string]: "0ms" }}>
                <span className="hl">&lt;</span> HELLO WORLD{" "}
                <span className="hl">/&gt;</span>
              </div>
              <h1 className="hero-name reveal" style={{ ["--d" as string]: "200ms" }}>
                I&apos;m <span className="name-colored">{meta.name}</span>
              </h1>
              <div className="hero-role reveal" style={{ ["--d" as string]: "400ms" }}>
                <span id="typewriter">
                  <Typewriter words={titles} />
                </span>
                <span className="cursor"></span>
              </div>
              <p className="hero-bio reveal" style={{ ["--d" as string]: "600ms" }}>
                {meta.heroBio}
              </p>
            </div>
            <div className="avatar-column bento-green">
              <div
                className="hero-avatar-box reveal"
                style={{ ["--d" as string]: "800ms" }}
              >
                <TiltCard>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pics/2.png" alt="Humendra Pun" className="avatar-img" />
                </TiltCard>
              </div>
            </div>
          </div>

          <div
            className="hero-btns-box bento-pink reveal"
            style={{ ["--d" as string]: "1200ms" }}
          >
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-ghost">
              Get in Touch
            </a>
          </div>
        </div>
        <a href="#about" className="hero-scroll">
          <div className="scroll-line"></div>
          <span>scroll</span>
        </a>
      </section>

      <div className="open-badge-fixed reveal" style={{ ["--d" as string]: "1000ms" }}>
        <div className="open-badge">
          <span className="pulse-dot"></span> Open to Work
        </div>
      </div>
    </>
  );
}
