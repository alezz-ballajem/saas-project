import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ['gitlab.sonod.tech'],
  },
  eslint: {
    // Skip ESLint during build to avoid workspace root config issues
    ignoreDuringBuilds: true,
  },
  env: {
    GITLAB_HOST: process.env.GITLAB_HOST,
    GITLAB_TOKEN: process.env.GITLAB_TOKEN,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
