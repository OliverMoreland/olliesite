import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS into ./out
  // and Vercel serves it with no server runtime.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
