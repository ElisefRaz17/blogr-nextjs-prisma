import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60,
  },
  providers: [
    process.env.VERCEL_ENV === "preview"
      ? (CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: {
              label: "Username",
              type: "text",
            },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            return {
              id: "1",
              name: "J Smith",
              email: "jsmith@example.com",
              image: "https://i.pravatar.cc/150?u=jsmith@example.com",
            };
          },
        }) as any) // Add this line to fix the error
      : GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          allowDangerousEmailAccountLinking: true,
        }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
