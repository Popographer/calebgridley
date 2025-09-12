// app/layout.jsx
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Caleb Gridley — Visual Artist, Photographer & Art Film Director",
  description: "Selected works and moving-image portfolio of Caleb Gridley.",
  metadataBase: new URL("https://calebgridley.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://cdn.calebgridley.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.calebgridley.com" />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />

        {/* Preload key posters (CDN) */}
        <link rel="preload" as="image" href="https://cdn.calebgridley.com/caleb-gridley-poster.webp" crossOrigin="" />
        <link rel="preload" as="image" href="https://cdn.calebgridley.com/body-of-work-poster.webp" crossOrigin="" />
        <link rel="preload" as="image" href="https://cdn.calebgridley.com/not-warhol-poster.webp" crossOrigin="" />
        <link rel="preload" as="image" href="https://cdn.calebgridley.com/augmentations-poster.webp" crossOrigin="" />

        {/* IMPORTANT: allow safe-area insets (fixes iOS bottom chrome overlap) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        <style>{`a[href="#content"], .skip-to-content { display: none !important; }`}</style>
        {children}
      </body>
    </html>
  );
}
