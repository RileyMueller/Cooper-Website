import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";

const validUsers = process.env.WHITELIST_VALID_USERS.split(",");

/**
 * 
 * @param handler handler checkIsInSession wraps around
 * @returns 
 */
export const checkIsInSession = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const isAuthorized = await getServerSession(req, res, authOptions);
    if (!isAuthorized) {
      res.status(401).send('Unauthorized');
      return;
    }

    await handler(req, res);
  };
};


export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // only allow sign in if the email is whitelisted
            return validUsers.indexOf(user.email) != -1;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default authHandler;
