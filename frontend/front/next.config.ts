import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'www.gravatar.com', 'i.blogs.es', 'images.unsplash.com',
      'tudominio.com', 'cdn.ejemplo.com', 'localhost',
      'blogger.googleusercontent.com', 's.gravatar.com',
      'lh3.googleusercontent.com', 'res.cloudinary.com',
      'encrypted-tbn0.gstatic.com'
    ],
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
