import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // явно кажемо Next.js що корінь — це frontend/
    root: __dirname,
  },
  // можеш додати ще опції
  reactStrictMode: true,
  images: {
    domains: ["localhost", "127.0.0.1"], // додай домени Strapi, коли розгорнеш
  },
};

export default nextConfig;
