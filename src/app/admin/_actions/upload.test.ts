import { describe, it, expect } from "vitest";
import { randomFilename, ALLOWED_MIME_TYPES } from "./upload-utils";

describe("randomFilename", () => {
  it("returns <uuid>.<ext> for image/png", () => {
    const name = randomFilename("photo.png", "image/png");
    expect(name).toMatch(/^[0-9a-f-]{36}\.png$/);
  });

  it("returns <uuid>.jpg for image/jpeg", () => {
    const name = randomFilename("img.jpg", "image/jpeg");
    expect(name).toMatch(/^[0-9a-f-]{36}\.jpg$/);
  });

  it("returns <uuid>.webp for image/webp", () => {
    const name = randomFilename("img.webp", "image/webp");
    expect(name).toMatch(/^[0-9a-f-]{36}\.webp$/);
  });

  it("returns <uuid>.gif for image/gif", () => {
    const name = randomFilename("anim.gif", "image/gif");
    expect(name).toMatch(/^[0-9a-f-]{36}\.gif$/);
  });

  it("throws on disallowed mime type", () => {
    expect(() => randomFilename("file.exe", "application/octet-stream")).toThrow(
      "Unsupported file type"
    );
  });

  it("throws on svg (not in allowlist)", () => {
    expect(() => randomFilename("icon.svg", "image/svg+xml")).toThrow(
      "Unsupported file type"
    );
  });

  it("generates unique names on repeated calls", () => {
    const a = randomFilename("x.png", "image/png");
    const b = randomFilename("x.png", "image/png");
    expect(a).not.toBe(b);
  });
});

describe("ALLOWED_MIME_TYPES", () => {
  it("contains exactly the four expected types", () => {
    expect(ALLOWED_MIME_TYPES).toEqual([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
    ]);
  });
});
