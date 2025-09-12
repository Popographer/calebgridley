// /app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // ✅ fixed: relative import for CSS
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Caleb Gridley — Visual Artist, Photographer & Art Film Director",
  description: "Selected works and moving-image portfolio of Caleb Gridley.",
  metadataBase: new URL("https://calebgridley.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect/DNS-prefetch to CDNs */}
        <link rel="preconnect" href="https://cdn.calebgridley.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.calebgridley.com" />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />

        {/* Preload key posters (CDN) */}
        <link
          rel="preload"
          as="image"
          href="https://cdn.calebgridley.com/caleb-gridley-poster.webp"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          href="https://cdn.calebgridley.com/body-of-work-poster.webp"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          href="https://cdn.calebgridley.com/not-warhol-poster.webp"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="image"
          href="https://cdn.calebgridley.com/augmentations-poster.webp"
          crossOrigin="anonymous"
        />

        {/* Allow safe-area insets (fixes iOS bottom chrome overlap) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        {/* Hide skip-to-content anchor (you’re not rendering one) */}
        <style>{`a[href="#content"], .skip-to-content { display: none !important; }`}</style>
        {children}
      </body>
    </html>
  );
}
