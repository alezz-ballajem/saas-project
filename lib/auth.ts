import { NextAuthOptions } from 'next-auth';
import GitLabProvider from 'next-auth/providers/gitlab';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gitlabHost = process.env.GITLAB_HOST || 'https://gitlab.sonod.tech';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitLabProvider({
      clientId: process.env.GITLAB_CLIENT_ID!,
      clientSecret: process.env.GITLAB_CLIENT_SECRET!,
      authorization: {
        url: `${gitlabHost}/oauth/authorize`,
        params: {
          scope: 'read_user read_api api',
        },
      },
      token: `${gitlabHost}/oauth/token`,
      userinfo: `${gitlabHost}/api/v4/user`,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Extend the session object safely without type conflicts
      (session as any).user = {
        ...(session.user || {}),
        id: (user as any)?.id,
        role: (user as any)?.role || 'USER',
      };
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || 'USER';
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
