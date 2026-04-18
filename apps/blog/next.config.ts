import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@debybe/ui', '@debybe/db'],
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;
