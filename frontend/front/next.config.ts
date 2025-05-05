import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "www.gravatar.com",
      "i.blogs.es",
      "images.unsplash.com",
      "tudominio.com",
      "cdn.ejemplo.com",
      "localhost",
      "blogger.googleusercontent.com",
      "s.gravatar.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "encrypted-tbn0.gstatic.com",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
  staticPageGenerationTimeout: 30000,
};

export default nextConfig;
