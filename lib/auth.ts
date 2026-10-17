import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/** Admin credentials auth (NextAuth v4) — reads ADMIN_EMAIL / ADMIN_PASSWORD / NEXTAUTH_SECRET from env. */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          credentials?.email?.toString().trim().toLowerCase() ?? "";
        const password = credentials?.password?.toString() ?? "";
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminPass = process.env.ADMIN_PASSWORD;
        if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
          return { id: "admin", name: "Yusr Books", email, role: "admin" };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "admin";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role =
          (token.role as string) ?? "admin";
      }
      return session;
    },
  },
};
