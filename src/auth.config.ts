import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      if (!isOnAdmin) return true;
      if (!auth?.user) return false;
      return auth.user.role === "ADMIN";
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
