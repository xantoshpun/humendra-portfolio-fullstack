import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export function resolveSourceDir(p: string): string {
  if (!fs.existsSync(p)) {
    throw new Error(`Source portfolio directory not found: ${p}`);
  }
  return p;
}

export function loadJson<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  techTags?: string[];
  thumbnailUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  order?: number;
  featured?: boolean;
  publishedAt?: string; // ISO date
}

export interface ProjectMd extends ProjectFrontmatter {
  slug: string;
  body: string;
}

export function loadProjectMarkdown(projectsDir: string): ProjectMd[] {
  if (!fs.existsSync(projectsDir)) return [];
  return fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const full = path.join(projectsDir, file);
      const raw = fs.readFileSync(full, "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        body: content.trim(),
        ...(data as ProjectFrontmatter),
      };
    });
}
