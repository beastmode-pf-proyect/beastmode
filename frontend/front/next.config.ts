import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /** @type {import('next').NextConfig} */

  images: {
    domains: ['s.gravatar.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: 'https',
        hostname: 's.gravatar.com',
        pathname: '/avatar/**',
      },
    ],
  },

  
};







export default nextConfig;
