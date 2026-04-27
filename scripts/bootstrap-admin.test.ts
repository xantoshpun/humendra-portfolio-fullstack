import { describe, it, expect, vi } from "vitest";
import { promoteToAdmin } from "./bootstrap-admin";

describe("promoteToAdmin", () => {
  it("updates the user's role to ADMIN when found", async () => {
    const updateMock = vi.fn().mockResolvedValue({ id: "1", email: "x@y.com", role: "ADMIN" });
    const findMock = vi.fn().mockResolvedValue({ id: "1", email: "x@y.com", role: "USER" });
    const fakeClient = { user: { findUnique: findMock, update: updateMock } } as any;

    const result = await promoteToAdmin(fakeClient, "x@y.com");

    expect(result.role).toBe("ADMIN");
    expect(updateMock).toHaveBeenCalledWith({
      where: { email: "x@y.com" },
      data: { role: "ADMIN" },
    });
  });

  it("throws if no user with that email exists", async () => {
    const fakeClient = {
      user: { findUnique: vi.fn().mockResolvedValue(null) },
    } as any;

    await expect(promoteToAdmin(fakeClient, "missing@x.com")).rejects.toThrow(
      /No user found/
    );
  });
});
