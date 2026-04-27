"use client";

import { signIn } from "next-auth/react";

export function LoginForm() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "320px", margin: "4rem auto" }}>
      <h1>Sign in</h1>
      <button
        onClick={() => signIn("github", { callbackUrl: "/admin" })}
        style={{ padding: "0.75rem 1rem", cursor: "pointer" }}
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
