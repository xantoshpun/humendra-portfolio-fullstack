import { describe, it, expect } from "vitest";
import {
  mapMeta,
  mapAbout,
  mapSkills,
  mapEducation,
  mapExperience,
  mapCertifications,
  mapProjects,
} from "./mappers";

describe("mappers", () => {
  it("maps meta", () => {
    const out = mapMeta({
      name: "X",
      initials: "X",
      location: "UK",
      email: "x@y.com",
      titles: ["A", "B"],
      heroBio: "bio",
      social: { github: "g", linkedin: "l" },
    });
    expect(out).toMatchObject({
      name: "X",
      initials: "X",
      titles: ["A", "B"],
      socials: { github: "g", linkedin: "l" },
    });
  });

  it("maps about", () => {
    const out = mapAbout({
      paragraphs: ["p1", "p2"],
      cards: [{ icon: "i", title: "t", sub: "s" }],
      terminal: { passion: "P" },
    });
    expect(out.terminalPassion).toBe("P");
    expect(out.paragraphs).toHaveLength(2);
  });

  it("maps skills with order from array index", () => {
    const out = mapSkills([
      { icon: "🗄️", title: "A", color: "cyan", tags: ["x"] },
      { icon: "📊", title: "B", color: "purple", tags: ["y"] },
    ]);
    expect(out[0].order).toBe(0);
    expect(out[1].order).toBe(1);
  });

  it("maps projects, defaulting publishedAt to now if absent", () => {
    const before = Date.now();
    const out = mapProjects([
      { slug: "p", title: "P", summary: "s", body: "b" },
    ]);
    expect(out[0].publishedAt!.getTime()).toBeGreaterThanOrEqual(before - 1000);
  });
});
