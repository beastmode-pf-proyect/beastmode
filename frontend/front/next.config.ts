import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /** @type {import('next').NextConfig} */
  matcher: ['/dashboard/:path*'],

  images: {
    domains: ['www.gravatar.com','https://i.blogs.es','images.unsplash.com',
              'tudominio.com', 'cdn.ejemplo.com', 'localhost','blogger.googleusercontent.com',
              's.gravatar.com', 'lh3.googleusercontent.com','res.cloudinary.com', 'encrypted-tbn0.gstatic.com'],
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
