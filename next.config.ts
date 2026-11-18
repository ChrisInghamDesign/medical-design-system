import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static site for https://<owner>.github.io/<repo>/
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/medical-design-system" : "";

const nextConfig: NextConfig = {
  ...(pages ? { output: "export", basePath, trailingSlash: true, images: { unoptimized: true } } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
