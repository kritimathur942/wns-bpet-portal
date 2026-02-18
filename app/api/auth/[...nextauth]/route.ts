import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db"; // Ensure this points to your Prisma client

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "WNS Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // CHECK NEON DATABASE INSTEAD OF HARDCODED LIST
        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        });

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            team: user.team, // Make sure Shailja's team comes through
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.team = (user as any).team; // Store team in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) { 
        session.user.role = token.role as any; 
      session.user.team = token.team as string;
      session.user.id = token.id as string;// Pass team to the UI
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };