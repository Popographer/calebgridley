// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  trailingSlash: true,

  reactStrictMode: true,

  // We serve images as-is on Pages
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "cdn.calebgridley.com" }
    ]
  },

  // Don’t block launch on lint warnings
  eslint: { ignoreDuringBuilds: true }
};

export default nextConfig;
