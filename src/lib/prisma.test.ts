import { describe, it, expect, vi, beforeAll } from "vitest";

// Prisma 7 requires a driver adapter at construction time. For unit tests of
// the singleton's hot-reload behavior, we mock both @prisma/client and the Neon
// adapter so the test doesn't need a real DB.
vi.mock("@prisma/client", () => {
  class PrismaClient {
    $connect = vi.fn();
    $disconnect = vi.fn();
    constructor(_opts?: unknown) {}
  }
  return { PrismaClient };
});

vi.mock("@prisma/adapter-neon", () => {
  class PrismaNeon {
    constructor(_opts?: unknown) {}
  }
  return { PrismaNeon };
});

process.env.DATABASE_URL ??= "postgres://test:test@localhost:5432/test";

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
