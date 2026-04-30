import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { auth } from "@/auth";
import { requireAdmin, UnauthorizedError } from "./actions";

const mockedAuth = vi.mocked(auth);

describe("requireAdmin", () => {
  afterEach(() => {
    mockedAuth.mockReset();
  });

  it("throws when there is no session", async () => {
    mockedAuth.mockResolvedValue(null);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("throws when session has no user", async () => {
    mockedAuth.mockResolvedValue({ user: null } as unknown as Awaited<ReturnType<typeof auth>>);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("throws when role is not ADMIN", async () => {
    mockedAuth.mockResolvedValue({
      user: { id: "u", email: "x@y", role: "USER" },
    } as unknown as Awaited<ReturnType<typeof auth>>);
    await expect(requireAdmin()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("returns the session when role is ADMIN", async () => {
    const session = {
      user: { id: "u", email: "x@y", role: "ADMIN" },
    } as unknown as Awaited<ReturnType<typeof auth>>;
    mockedAuth.mockResolvedValue(session);
    const out = await requireAdmin();
    expect(out).toBe(session);
  });
});
