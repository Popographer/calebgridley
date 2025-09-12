// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.squarespace-cdn.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "cdn.calebgridley.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // You currently ignore lint issues during builds. Keep or tighten later.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
