import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
  webpack(config, { isServer }) {
    config.infrastructureLogging = {
      level: 'verbose',
    };
    return config;
  },
};

export default nextConfig;
