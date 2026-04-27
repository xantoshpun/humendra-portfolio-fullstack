import { describe, it, expect, vi, beforeAll } from "vitest";

// Prisma 7 uses the "client" engine which requires a driver adapter at construction
// time. We mock @prisma/client so the singleton logic is tested without needing a
// real database connection or an installed adapter package.
vi.mock("@prisma/client", () => {
  class PrismaClient {
    $connect = vi.fn();
    $disconnect = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(_opts?: any) {}
  }
  return { PrismaClient };
});

// Import *after* the mock is registered so the module sees the mock.
// We use a dynamic import + clearMocks-safe re-import via module cache.
let prisma: { $connect: () => Promise<void>; $disconnect: () => Promise<void> };

beforeAll(async () => {
  const mod = await import("./prisma");
  prisma = mod.prisma as typeof prisma;
});

describe("prisma singleton", () => {
  it("exports a PrismaClient instance", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
  });

  it("returns the same instance on repeated import", async () => {
    const { prisma: prisma2 } = await import("./prisma");
    expect(prisma).toBe(prisma2);
  });
});
