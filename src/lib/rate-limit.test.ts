import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit, RateLimitedError } from "./rate-limit";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("checkRateLimit", () => {
  it("allows requests under the limit", () => {
    for (let i = 0; i < 30; i++) {
      expect(() => checkRateLimit("user-a", "upload")).not.toThrow();
    }
  });

  it("throws RateLimitedError when limit is exceeded", () => {
    for (let i = 0; i < 30; i++) checkRateLimit("user-b", "upload");
    expect(() => checkRateLimit("user-b", "upload")).toThrow(RateLimitedError);
  });

  it("refills tokens after one hour", () => {
    for (let i = 0; i < 30; i++) checkRateLimit("user-c", "upload");
    expect(() => checkRateLimit("user-c", "upload")).toThrow(RateLimitedError);

    vi.advanceTimersByTime(60 * 60 * 1000);

    expect(() => checkRateLimit("user-c", "upload")).not.toThrow();
  });

  it("keeps separate buckets per user", () => {
    for (let i = 0; i < 30; i++) checkRateLimit("user-x", "upload");
    expect(() => checkRateLimit("user-x", "upload")).toThrow(RateLimitedError);
    expect(() => checkRateLimit("user-y", "upload")).not.toThrow();
  });

  it("keeps separate buckets per action key", () => {
    for (let i = 0; i < 30; i++) checkRateLimit("user-d", "upload");
    expect(() => checkRateLimit("user-d", "upload")).toThrow(RateLimitedError);
    expect(() => checkRateLimit("user-d", "other")).not.toThrow();
  });
});
