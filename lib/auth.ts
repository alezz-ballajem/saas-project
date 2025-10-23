import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  gitlabId: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: string;
}

const GITLAB_HOST = process.env.GITLAB_HOST || 'https://gitlab.sonod.tech';
const GITLAB_CLIENT_ID = process.env.GITLAB_CLIENT_ID!;
const GITLAB_CLIENT_SECRET = process.env.GITLAB_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export class GitLabAuth {
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GITLAB_CLIENT_ID,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/gitlab`,
      response_type: 'code',
      scope: 'read_user read_api api',
      state: this.generateState(),
    });
    
    return `${GITLAB_HOST}/oauth/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<any> {
    const response = await fetch(`${GITLAB_HOST}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GITLAB_CLIENT_ID,
        client_secret: GITLAB_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/gitlab`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  static async getUserInfo(accessToken: string): Promise<any> {
    const response = await fetch(`${GITLAB_HOST}/api/v4/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }

  static async createOrUpdateUser(gitlabUser: any): Promise<User> {
    const userData = {
      gitlabId: gitlabUser.id.toString(),
      name: gitlabUser.name,
      email: gitlabUser.email,
      image: gitlabUser.avatar_url,
      role: 'USER' as const,
    };

    const user = await prisma.user.upsert({
      where: { gitlabId: gitlabUser.id.toString() },
      update: userData,
      create: userData,
    });

    return user as User;
  }

  static generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  static async getSession(token: string): Promise<Session | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: token },
      });

      if (!user) return null;

      return {
        user: user as User,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      };
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
}