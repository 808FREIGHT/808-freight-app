import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Prevent trailing slash redirects for API routes
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
