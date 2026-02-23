import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the app to run on any port
  experimental: {
    // Enable server actions
  },
  // Disable strict mode to prevent double renders in development
  reactStrictMode: false,
  // Allow images from any domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
