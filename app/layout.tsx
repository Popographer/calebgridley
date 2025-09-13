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

        {/* GLOBAL JSON-LD: WebSite (host), Person (authoritative), Organization (ref) */}
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
                  "@id": "https://calebgridley.com/#website/",
                  "url": "https://calebgridley.com/",
                  "name": "Caleb Gridley",
                  "inLanguage": "en",
                  "publisher": { "@id": "https://popographer.com/#org/" }
                },

                {
                  "@type": "Person",
                  "@id": "https://calebgridley.com/#person/",
                  "name": "Caleb Gridley",
                  "alternateName": "Popographer",
                  "url": "https://calebgridley.com/",
                  "image": { "@id": "https://calebgridley.com/identity/#hero" },
                  "description": "Caleb Gridley is a visual artist, photographer, and art film director whose practice under Popographer explores celebrity, digital identity, and cultural transformation.",
                  "jobTitle": ["Visual Artist","Photographer","Art Film Director"],
                  "worksFor": { "@id": "https://popographer.com/#org/" },
                  "brand": { "@id": "https://popographer.com/#org/" },
                  "alumniOf": {
                    "@type": "CollegeOrUniversity",
                    "name": "Louisiana State University",
                    "sameAs": "https://design.lsu.edu/"
                  },
                  "birthPlace": {
                    "@type": "Place",
                    "address": { "@type": "PostalAddress", "addressRegion": "LA", "addressCountry": { "@type": "Country", "name": "US" } }
                  },
                  "homeLocation": {
                    "@type": "Place",
                    "address": { "@type": "PostalAddress", "addressRegion": "LA", "addressCountry": { "@type": "Country", "name": "US" } }
                  },
                  "knowsLanguage": ["en"],
                  "knowsAbout": [
                    "Fashion","Photography","Art Film Direction","Performance Art",
                    "Digital Identity","Pop Culture","Conceptual Art","Surrealism",
                    "Costume Design","3D Modeling"
                  ],
                  "notableWork": [
                    { "@id": "https://popographer.com/artwork/not-warhol/#work/" },
                    { "@id": "https://popographer.com/artwork/augmentations/#work/" },
                    { "@id": "https://popographer.com/artwork/anointing-the-artifice/#work/" },
                    { "@id": "https://popographer.com/artwork/body-of-work/#work/" }
                  ],
                  "subjectOf": [
                    { "@id": "https://popographer.com/press/#ext-canvasrebel/" },
                    { "@id": "https://popographer.com/press/#ext-charliefeet/" },
                    { "@id": "https://popographer.com/press/#ext-225mag/" },
                    { "@id": "https://popographer.com/press/#ext-advocate/" }
                  ],
                  "sameAs": [
                    // Owned domains
                    "https://calebgridley.com/",
                    "https://popographer.com/",
                    "https://notwarhol.com/",
                    "https://popograph.com/",
                    "https://pop-ographer.com/",
                    "https://popographer.co/",
                    // Socials / profiles
                    "https://www.instagram.com/thepopographer/",
                    "https://www.youtube.com/@popographer",
                    "https://vimeo.com/popographer",
                    "https://www.facebook.com/Popographer/",
                    "https://www.flickr.com/photos/201678917@N06/",
                    // Credits
                    "https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant",
                    "https://www.discogs.com/release/33932553-Arcade-Fire-Pink-Elephant"
                  ],
                  // Make identity page the canonical page for this Person
                  "mainEntityOfPage": { "@id": "https://calebgridley.com/identity/#webpage" }
                },

                {
                  "@type": "Organization",
                  "@id": "https://popographer.com/#org/",
                  "name": "Popographer LLC",
                  "legalName": "Popographer LLC",
                  "url": "https://popographer.com/",
                  "foundingLocation": {
                    "@type": "Place",
                    "address": { "@type": "PostalAddress", "addressRegion": "LA", "addressCountry": "US" }
                  },
                  "founder": { "@id": "https://calebgridley.com/#person/" },
                  "sameAs": [
                    // Domains
                    "https://calebgridley.com/",
                    "https://popographer.com/",
                    "https://notwarhol.com/",
                    "https://popograph.com/",
                    "https://pop-ographer.com/",
                    "https://popographer.co/",
                    // Brand socials
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
