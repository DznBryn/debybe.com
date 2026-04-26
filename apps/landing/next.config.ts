import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@debybe/ui', '@debybe/graphql'],
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
