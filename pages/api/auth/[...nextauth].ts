import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import prisma from '../../../lib/prisma';

const validUsers = process.env.WHITELIST_VALID_USERS.split(',');

const options = {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
    
    callbacks: {
      async signIn({user, account, profile, email, credentials}){
        // only allow sign in if the email is whitelisted
        return validUsers.indexOf(user.email) != -1;
      },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;