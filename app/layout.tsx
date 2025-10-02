// /app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";

import {
  SITE_ORIGIN,
  PERSON_ID,
  PERSON_NAME,
  PERSON_SAME_AS,
  ORG_ID,
  ORG_NAME,
  ORG_SAME_AS,
  ORG_IDENTIFIERS,
  ORG_LOGO_URL,
  ORG_LOGO_ID,
} from "../lib/identity";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Caleb Gridley — Visual Artist, Photographer & Art Film Director",
  description: "Selected works and moving-image portfolio of Caleb Gridley.",
  metadataBase: new URL(SITE_ORIGIN),
  alternates: { canonical: "/" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const personSameAs = [
    "https://calebgridley.com/",
    "https://popographer.com/",
    "https://notwarhol.com/",
    "https://popograph.com/",
    "https://pop-ographer.com/",
    "https://popographer.co/",
    "https://www.instagram.com/thepopographer/",
    "https://www.youtube.com/@popographer",
    "https://vimeo.com/popographer",
    "https://www.facebook.com/Popographer/",
    "https://www.flickr.com/photos/201678917@N06/",
    "https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant",
    "https://www.discogs.com/release/33932553-Arcade-Fire-Pink-Elephant",
    ...PERSON_SAME_AS,
  ];

  const orgSameAs = [
    "https://calebgridley.com/",
    "https://popographer.com/",
    "https://notwarhol.com/",
    "https://popograph.com/",
    "https://pop-ographer.com/",
    "https://popographer.co/",
    "https://www.instagram.com/thepopographer/",
    "https://www.youtube.com/@popographer",
    "https://vimeo.com/popographer",
    ...ORG_SAME_AS,
  ];

  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://cdn.calebgridley.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.calebgridley.com" />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />

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

        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="dark light" />
        <meta name="theme-color" content="#000000" />

        <Script
          id="sitewide-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_ORIGIN}#website`,
                  "url": `${SITE_ORIGIN}/`,
                  "name": PERSON_NAME,
                  "inLanguage": "en",
                  "publisher": { "@id": ORG_ID }
                },
                {
                  "@type": "Person",
                  "@id": PERSON_ID,
                  "name": PERSON_NAME,
                  "alternateName": "Popographer",
                  "url": `${SITE_ORIGIN}/`,
                  "image": { "@id": "https://calebgridley.com/identity#hero" },
                  "description": "Caleb Gridley is a visual artist, photographer, and art film director whose practice under Popographer explores celebrity, digital identity, and cultural transformation.",
                  "jobTitle": ["Visual Artist","Photographer","Art Film Director", "Fashion Designer"],
                  "worksFor": { "@id": ORG_ID },
                  "brand": { "@id": ORG_ID },
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
                    { "@id": "https://popographer.com/artwork/not-warhol#work" },
                    { "@id": "https://popographer.com/artwork/body-of-work#work" },
                    { "@id": "https://popographer.com/artwork/anointing-the-artifice#work" },
                    { "@id": "https://popographer.com/artwork/augmentations#work" }
                  ],
                  "subjectOf": [
                    { "@id": "https://popographer.com/press#ext-canvasrebel" },
                    { "@id": "https://popographer.com/press#ext-charliefeet" },
                    { "@id": "https://popographer.com/press#ext-225mag" },
                    { "@id": "https://popographer.com/press#ext-advocate" }
                  ],
                  "sameAs": personSameAs,
                  "mainEntityOfPage": { "@id": "https://calebgridley.com/identity#webpage" }
                },
                {
                  "@type": "Organization",
                  "@id": ORG_ID,
                  "name": ORG_NAME,
                  "legalName": ORG_NAME,
                  "url": "https://popographer.com/",
                  "foundingLocation": {
                    "@type": "Place",
                    "address": { "@type": "PostalAddress", "addressRegion": "LA", "addressCountry": "US" }
                  },
                  "founder": { "@id": PERSON_ID },
                  "sameAs": orgSameAs,
                  "identifier": ORG_IDENTIFIERS,
                  "logo": {
                    "@type": "ImageObject",
                    "@id": ORG_LOGO_ID,
                    "url": ORG_LOGO_URL
                  }
                },
                {
                  "@type": "ImageObject",
                  "@id": "https://calebgridley.com/identity#hero",
                  "url": "https://cdn.calebgridley.com/caleb-gridley_identity-hero_1820x1080_v1.webp",
                  "width": 1820,
                  "height": 1080,
                  "inLanguage": "en"
                },
                {
                  "@type": "WebPage",
                  "@id": "https://calebgridley.com/identity#webpage",
                  "url": "https://calebgridley.com/identity/",
                  "name": "Identity | Caleb Gridley",
                  "isPartOf": { "@id": `${SITE_ORIGIN}#website` },
                  "primaryImageOfPage": { "@id": "https://calebgridley.com/identity#hero" },
                  "inLanguage": "en"
                }
              ]
            })
          }}
        />
      </head>

      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        <style>{`a[href="#content"], .skip-to-content { display: none !important; }`}</style>
        {children}
      </body>
    </html>
  );
}
