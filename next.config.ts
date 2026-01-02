import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",

  // Optimize for production
  compress: true,

  // Image optimization
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Base path for the dashboard application
  basePath: "/dashboard",
};

export default nextConfig;
