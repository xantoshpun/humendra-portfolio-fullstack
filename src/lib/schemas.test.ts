import { describe, expect, it } from "vitest";
import {
  SiteMetaSchema,
  AboutSchema,
  SkillSchema,
  EducationSchema,
  ExperienceSchema,
  CertificationSchema,
  StatSchema,
  ProjectSchema,
} from "./schemas";

describe("SiteMetaSchema", () => {
  const valid = {
    name: "Humendra Pun",
    initials: "HP",
    location: "London, UK",
    email: "test@example.com",
    heroBio: "Bio text.",
    titles: ["Data Analyst"],
    socials: { github: "https://github.com/x" },
  };

  it("accepts a valid record", () => {
    expect(SiteMetaSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(SiteMetaSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects invalid email", () => {
    expect(SiteMetaSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("accepts empty titles array", () => {
    expect(SiteMetaSchema.safeParse({ ...valid, titles: [] }).success).toBe(true);
  });

  it("accepts empty socials object", () => {
    expect(SiteMetaSchema.safeParse({ ...valid, socials: {} }).success).toBe(true);
  });

  it("rejects non-URL social value", () => {
    expect(
      SiteMetaSchema.safeParse({ ...valid, socials: { github: "not a url" } }).success
    ).toBe(false);
  });
});

describe("AboutSchema", () => {
  const valid = {
    paragraphs: ["First.", "Second."],
    cards: [{ icon: "code", title: "Title", sub: "Sub" }],
    terminalPassion: "snippet",
  };

  it("accepts valid", () => {
    expect(AboutSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts empty paragraphs array", () => {
    expect(AboutSchema.safeParse({ ...valid, paragraphs: [] }).success).toBe(true);
  });

  it("accepts null terminalPassion", () => {
    expect(AboutSchema.safeParse({ ...valid, terminalPassion: null }).success).toBe(true);
  });
});

describe("SkillSchema", () => {
  const valid = { icon: "📊", title: "Power BI", color: "cyan" as const, tags: ["DAX"], order: 0 };

  it("accepts valid", () => {
    expect(SkillSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty title", () => {
    expect(SkillSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("rejects unknown color", () => {
    expect(SkillSchema.safeParse({ ...valid, color: "red" }).success).toBe(false);
  });

  it("accepts empty tags array", () => {
    expect(SkillSchema.safeParse({ ...valid, tags: [] }).success).toBe(true);
  });

  it("rejects non-array tags", () => {
    expect(SkillSchema.safeParse({ ...valid, tags: "DAX" as unknown }).success).toBe(false);
  });
});

describe("EducationSchema", () => {
  const valid = {
    degree: "MSc Data Science",
    institution: "Solent",
    date: "October 2023",
    honour: null,
    honourColor: null,
    focus: ["ML"],
    order: 0,
  };

  it("accepts valid", () => {
    expect(EducationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty degree", () => {
    expect(EducationSchema.safeParse({ ...valid, degree: "" }).success).toBe(false);
  });

  it("accepts null honour fields", () => {
    expect(EducationSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects unknown honourColor", () => {
    expect(
      EducationSchema.safeParse({ ...valid, honour: "Distinction", honourColor: "red" }).success
    ).toBe(false);
  });
});

describe("ExperienceSchema", () => {
  const valid = {
    role: "Analyst",
    company: "Acme",
    date: "2024-Present",
    badgeColor: "cyan" as const,
    badgeText: "Current",
    skills: ["SQL"],
    order: 0,
  };

  it("accepts valid", () => {
    expect(ExperienceSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty role", () => {
    expect(ExperienceSchema.safeParse({ ...valid, role: "" }).success).toBe(false);
  });

  it("accepts null badge fields", () => {
    expect(
      ExperienceSchema.safeParse({ ...valid, badgeColor: null, badgeText: null }).success
    ).toBe(true);
  });
});

describe("CertificationSchema", () => {
  const valid = {
    img: "icon.svg",
    name: "Cert Name",
    issuer: "Provider",
    date: "2024",
    order: 0,
  };

  it("accepts valid", () => {
    expect(CertificationSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts null img", () => {
    expect(CertificationSchema.safeParse({ ...valid, img: null }).success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(CertificationSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });
});

describe("StatSchema", () => {
  const valid = {
    value: 60,
    prefix: null,
    suffix: "%",
    display: "↓60%",
    label: "Reduction",
    accent: "cyan" as const,
    order: 0,
  };

  it("accepts valid", () => {
    expect(StatSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects unknown accent", () => {
    expect(StatSchema.safeParse({ ...valid, accent: "red" }).success).toBe(false);
  });

  it("rejects empty display", () => {
    expect(StatSchema.safeParse({ ...valid, display: "" }).success).toBe(false);
  });
});

describe("ProjectSchema", () => {
  const valid = {
    slug: "my-project",
    title: "My project",
    summary: "Short summary.",
    body: "# Body",
    thumbnailUrl: null,
    techTags: ["python"],
    liveUrl: null,
    repoUrl: null,
    order: 0,
    featured: false,
    publishedAt: null,
  };

  it("accepts valid", () => {
    expect(ProjectSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects slug with whitespace", () => {
    expect(ProjectSchema.safeParse({ ...valid, slug: "my project" }).success).toBe(false);
  });

  it("rejects uppercase slug", () => {
    expect(ProjectSchema.safeParse({ ...valid, slug: "My-Project" }).success).toBe(false);
  });

  it("accepts ISO publishedAt string", () => {
    const out = ProjectSchema.safeParse({
      ...valid,
      publishedAt: new Date("2024-01-01").toISOString(),
    });
    expect(out.success).toBe(true);
  });

  it("accepts publishedAt as Date", () => {
    expect(ProjectSchema.safeParse({ ...valid, publishedAt: new Date() }).success).toBe(true);
  });

  it("rejects invalid liveUrl", () => {
    expect(ProjectSchema.safeParse({ ...valid, liveUrl: "not a url" }).success).toBe(false);
  });
});
