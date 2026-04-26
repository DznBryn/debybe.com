import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@debybe/ui', '@debybe/db', '@debybe/graphql'],
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
