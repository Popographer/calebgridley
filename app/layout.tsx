// /app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Caleb Gridley — Visual Artist, Photographer & Art Film Director",
  description: "Selected works and moving-image portfolio of Caleb Gridley.",
  metadataBase: new URL("https://calebgridley.com"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
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

        {/* Viewport / theme */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" />
      </head>

      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        {/* Hide skip-to-content anchor (none rendered) */}
        <style>{`a[href="#content"], .skip-to-content { display: none !important; }`}</style>

        {children}

        {/* GLOBAL JSON-LD: WebSite + Person + Organization */}
        <Script
          id="sitewide-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://calebgridley.com/#website",
                  url: "https://calebgridley.com/",
                  name: "Caleb Gridley",
                  inLanguage: "en",
                  publisher: { "@id": "https://popographer.com/#org" }
                },
                {
                  "@type": "Person",
                  "@id": "https://calebgridley.com/#person",
                  name: "Caleb Gridley",
                  alternateName: "Popographer",
                  url: "https://calebgridley.com/",
                  description: "American visual artist, photographer, and art film director.",
                  worksFor: { "@id": "https://popographer.com/#org" },
                  sameAs: [
                    // Owned domains
                    "https://calebgridley.com/",
                    "https://popographer.com/",
                    "https://notwarhol.com/",
                    "https://popograph.com/",
                    "https://pop-ographer.com/",
                    "https://popographer.co/",
                    // Socials
                    "https://www.instagram.com/thepopographer/",
                    "https://www.youtube.com/@popographer",
                    "https://vimeo.com/popographer"
                  ],
                  mainEntityOfPage: { "@id": "https://calebgridley.com/#website" }
                },
                {
                  "@type": "Organization",
                  "@id": "https://popographer.com/#org",
                  name: "Popographer LLC",
                  legalName: "Popographer LLC",
                  url: "https://popographer.com/",
                  foundingLocation: {
                    "@type": "Place",
                    address: { "@type": "PostalAddress", addressRegion: "LA", addressCountry: "US" }
                  },
                  sameAs: [
                    // Domains (mirrored)
                    "https://calebgridley.com/",
                    "https://popographer.com/",
                    "https://notwarhol.com/",
                    "https://popograph.com/",
                    "https://pop-ographer.com/",
                    "https://popographer.co/",
                    // Socials (brand-level)
                    "https://www.instagram.com/thepopographer/",
                    "https://www.youtube.com/@popographer",
                    "https://vimeo.com/popographer"
                  ]
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
