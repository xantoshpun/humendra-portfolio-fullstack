"use client";

import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  words: string[];
  /** Initial delay before the typewriter starts modifying the text. */
  startDelayMs?: number;
}

/**
 * Typewriter effect that mirrors the inline script in `portfolio/src/components/Hero.astro`.
 * - Starts already showing words[0]
 * - After `startDelayMs`, begins deleting it, then types each subsequent word.
 * - Pauses 2200ms between full words, types at 88ms/char, deletes at 48ms/char.
 */
export function Typewriter({ words, startDelayMs = 4000 }: TypewriterProps) {
  const [text, setText] = useState(() => words[0] ?? "");
  const startedRef = useRef(false);

  useEffect(() => {
    if (words.length === 0) return;
    if (startedRef.current) return;
    startedRef.current = true;

    let pi = 0;
    let ci = words[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const cur = words[pi];
      if (deleting) {
        ci -= 1;
        setText(cur.slice(0, ci));
      } else {
        ci += 1;
        setText(cur.slice(0, ci));
      }

      if (!deleting && ci === cur.length) {
        deleting = true;
        timer = setTimeout(tick, 2200);
        return;
      }
      if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % words.length;
      }
      timer = setTimeout(tick, deleting ? 48 : 88);
    };

    const startTimer = setTimeout(tick, startDelayMs);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [words, startDelayMs]);

  return <>{text}</>;
}
