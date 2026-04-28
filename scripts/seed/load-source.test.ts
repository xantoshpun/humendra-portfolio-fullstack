import { describe, it, expect } from "vitest";
import path from "node:path";
import { resolveSourceDir, loadJson, loadProjectMarkdown } from "./load-source";

const FIXTURE = path.resolve(__dirname, "__fixtures__/portfolio");

describe("resolveSourceDir", () => {
  it("returns the configured path when it exists", () => {
    expect(resolveSourceDir(FIXTURE)).toBe(FIXTURE);
  });
  it("throws when the path doesn't exist", () => {
    expect(() => resolveSourceDir("/no/such/path")).toThrow(/not found/i);
  });
});

describe("loadJson", () => {
  it("parses a JSON file", () => {
    const data = loadJson<{ name: string }>(path.join(FIXTURE, "src/data/meta.json"));
    expect(data.name).toBe("Test User");
  });
});

describe("loadProjectMarkdown", () => {
  it("parses frontmatter and body", () => {
    const projects = loadProjectMarkdown(path.join(FIXTURE, "src/content/projects"));
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      slug: "demo-project",
      title: "Demo",
      body: expect.stringContaining("Body content"),
    });
  });
});
