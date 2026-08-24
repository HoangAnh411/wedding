import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // Removed to fix Vercel build
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/demo",
      destination: "/vi/minh-linh",
      permanent: false,
    },
  ],
};

export default nextConfig;