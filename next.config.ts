import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true,
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
