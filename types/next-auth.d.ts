import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // This must match your Prisma Enum exactly
      role: "MANAGER" | "LEAD" | "ANALYST" | "USER";
      team: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: "MANAGER" | "LEAD" | "ANALYST" | "USER";
    team: string;
  }
}