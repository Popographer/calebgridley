// app/identity/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import styles from "./identity.module.css"; // ← scoped styles for this route

const HERO_URL = "https://cdn.calebgridley.com/augmentations-poster.webp"; // 1820x1080
const CARD_PNG = "https://cdn.calebgridley.com/caleb-gridley_identity-card_1080x1080.png";
const CARD_WEBP = "https://cdn.calebgridley.com/caleb-gridley_identity-card_1080x1080.webp";

export const metadata: Metadata = {
  title: "Identity | Caleb Gridley",
  description:
    "Official identity page for Caleb Gridley, visual artist, photographer, and art film director.",
  alternates: { canonical: "https://calebgridley.com/identity/" },
  openGraph: {
    url: "https://calebgridley.com/identity/",
    title: "Identity | Caleb Gridley",
    description:
      "Official identity page for Caleb Gridley, visual artist, photographer, and art film director.",
    siteName: "Caleb Gridley",
    type: "website",
    images: [
      { url: CARD_PNG, width: 1080, height: 1080, type: "image/png" },
      { url: CARD_WEBP, width: 1080, height: 1080, type: "image/webp" },
      { url: HERO_URL, width: 1820, height: 1080 }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Identity | Caleb Gridley",
    description:
      "Official identity page for Caleb Gridley, visual artist, photographer, and art film director.",
    images: [CARD_PNG, CARD_WEBP]
  },
  robots: { index: true, follow: true },
  themeColor: "#ffffff"
};

export default function IdentityPage() {
  const dateModified = "2025-09-12";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "ProfilePage"],
        "@id": "https://calebgridley.com/identity/#webpage",
        url: "https://calebgridley.com/identity/",
        name: "Identity",
        description:
          "Identity information for Caleb Gridley. Official domains, socials, press, exhibitions, and legal notes.",
        isPartOf: { "@id": "https://calebgridley.com/#website" },
        breadcrumb: { "@id": "https://calebgridley.com/identity/#breadcrumbs" },
        about: { "@id": "https://calebgridley.com/#person" },
        mainEntity: { "@id": "https://calebgridley.com/#person" },
        publisher: { "@id": "https://popographer.com/#org" },
        primaryImageOfPage: { "@id": "https://calebgridley.com/identity/#hero" },
        inLanguage: "en",
        dateModified
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://calebgridley.com/identity/#breadcrumbs",
        name: "Breadcrumbs",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://calebgridley.com/" },
          { "@type": "ListItem", position: 2, name: "Identity", item: "https://calebgridley.com/identity/" }
        ]
      },
      {
        "@type": "ImageObject",
        "@id": "https://calebgridley.com/identity/#hero",
        name: "Caleb Gridley",
        caption: "Caleb Gridley",
        contentUrl: HERO_URL,
        url: HERO_URL,
        encodingFormat: "image/webp",
        width: 1820,
        height: 1080,
        representativeOfPage: true,
        creditText: "Caleb Gridley (Popographer)",
        creator: { "@id": "https://calebgridley.com/#person" },
        copyrightHolder: { "@id": "https://calebgridley.com/#person" },
        copyrightNotice: "© Caleb Gridley. All rights reserved.",
        license: "https://popographer.com/licensing/",
        acquireLicensePage: "https://popographer.com/licensing/"
      },
      {
        "@type": "Person",
        "@id": "https://calebgridley.com/#person",
        name: "Caleb Gridley",
        alternateName: "Popographer",
        description: "American visual artist, photographer, and art film director.",
        url: "https://calebgridley.com/",
        worksFor: { "@id": "https://popographer.com/#org" },
        identifier: [],
        sameAs: [
          "https://calebgridley.com/",
          "https://popographer.com/",
          "https://notwarhol.com/",
          "https://popograph.com/",
          "https://pop-ographer.com/",
          "https://popographer.co/",
          "https://www.instagram.com/thepopographer/",
          "https://www.youtube.com/@popographer",
          "https://vimeo.com/popographer"
        ],
        subjectOf: [
          {
            "@type": "WebPage",
            "@id": "https://popographer.com/press/#ext-canvasrebel/",
            name: "Meet Caleb Gridley",
            url: "https://canvasrebel.com/meet-caleb-gridley/",
            mainEntityOfPage: "https://canvasrebel.com/meet-caleb-gridley/",
            inLanguage: "en"
          },
          {
            "@type": "WebPage",
            "@id": "https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant",
            name: "Arcade Fire — Pink Elephant (Discogs release; booklet credit)",
            url: "https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant",
            inLanguage: "en"
          }
        ],
        mainEntityOfPage: { "@id": "https://calebgridley.com/identity/#webpage" }
      },
      {
        "@type": "ItemList",
        "@id": "https://calebgridley.com/identity/#selected-works",
        name: "Selected works",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Not Warhol", item: { "@id": "https://popographer.com/artwork/not-warhol/#work" } },
          { "@type": "ListItem", position: 2, name: "Anointing the Artifice", item: { "@id": "https://popographer.com/artwork/anointing-the-artifice/#work" } },
          { "@type": "ListItem", position: 3, name: "Body of Work", item: { "@id": "https://popographer.com/artwork/body-of-work/#work" } },
          { "@type": "ListItem", position: 4, name: "Augmentations", item: { "@id": "https://popographer.com/artwork/augmentations/#work" } }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://popographer.com/#org",
        name: "Popographer LLC",
        legalName: "Popographer LLC",
        url: "https://popographer.com/",
        foundingLocation: {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "LA",
            "addressCountry": "US"
          }
        },
        sameAs: [
          "https://calebgridley.com/",
          "https://popographer.com/",
          "https://notwarhol.com/",
          "https://popograph.com/",
          "https://pop-ographer.com/",
          "https://popographer.co/",
          "https://www.instagram.com/thepopographer/",
          "https://www.youtube.com/@popographer",
          "https://vimeo.com/popographer"
        ]
      }
    ]
  };

  return (
    <div className="bg-white text-neutral-900 font-sans">
      {/* skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-black text-white px-3 py-2 rounded"
      >
        Skip to content
      </a>

      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white/85 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border-b border-neutral-200"
        aria-label="Primary"
      >
        <nav
          className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between"
          aria-label="Global"
        >
          <span className="text-sm tracking-widest font-semibold">CALEB GRIDLEY</span>
          <ul className="flex gap-5 text-sm">
            <li><a href="#press" className="hover:text-gray-600 transition-colors">PRESS</a></li>
            <li><a href="#exhibitions" className="hover:text-gray-600 transition-colors">EXHIBITIONS</a></li>
            <li><a href="#domains" className="hover:text-gray-600 transition-colors">DOMAINS</a></li>
            <li><a href="#credits" className="hover:text-gray-600 transition-colors">CREDITS</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-6 py-12">
        <h1 className={`text-4xl font-semibold tracking-tight uppercase ${styles.fadeUp}`}>CALEB GRIDLEY</h1>
        <p className={`mt-3 text-lg ${styles.fadeUp}`} style={{ animationDelay: ".05s" }}>
          American visual artist, photographer, and art film director. Also known as Popographer.
        </p>

        {/* Hero */}
        <figure className={styles.fadeUp} style={{ animationDelay: ".1s" }}>
          <Image
            src={HERO_URL}
            alt="Caleb Gridley"
            width={1820}
            height={1080}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            className="mt-8 w-full h-auto rounded-2xl shadow-sm"
          />
          <figcaption className="mt-2 text-sm text-neutral-500">
            Caleb Gridley. © Caleb Gridley.
          </figcaption>
        </figure>

        {/* Content grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <section id="domains" aria-labelledby="domains-h" className={styles.fadeUp} style={{ animationDelay: ".15s" }}>
            <h2 id="domains-h" className="text-sm font-semibold tracking-widest uppercase">OFFICIAL DOMAINS</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="https://calebgridley.com/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">CALEBGRIDLEY.COM</a></li>
              <li><a href="https://popographer.com/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">POPOGRAPHER.COM</a></li>
              <li><a href="https://notwarhol.com/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">NOTWARHOL.COM</a></li>
            </ul>
          </section>

          <section aria-labelledby="socials-h" className={styles.fadeUp} style={{ animationDelay: ".2s" }}>
            <h2 id="socials-h" className="text-sm font-semibold tracking-widest uppercase">SOCIALS</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="https://www.instagram.com/thepopographer/" className="underline underline-offset-2 hover:text-gray-600 transition-colors" rel="me">INSTAGRAM @THEPOPOGRAPHER</a></li>
              <li><a href="https://www.youtube.com/@popographer" className="underline underline-offset-2 hover:text-gray-600 transition-colors" rel="me">YOUTUBE @POPOGRAPHER</a></li>
              <li><a href="https://vimeo.com/popographer" className="underline underline-offset-2 hover:text-gray-600 transition-colors" rel="me">VIMEO @POPOGRAPHER</a></li>
            </ul>
          </section>

          <section id="press" aria-labelledby="press-h" className={`${styles.fadeUp} md:col-span-2`} style={{ animationDelay: ".25s" }}>
            <h2 id="press-h" className="text-sm font-semibold tracking-widest uppercase">PRESS AND INTERVIEWS</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="https://canvasrebel.com/meet-caleb-gridley/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">CanvasRebel — “Meet Caleb Gridley”</a></li>
              <li><a href="https://www.225batonrouge.com/things-to-do/week-baton-rouge-kids-art-fitness-pride-exhibit" className="underline underline-offset-2 hover:text-gray-600 transition-colors">225 Magazine — Week guide mention</a></li>
              <li><a href="https://www.charliefeet.com/leur-blog/anointing-the-artifice-by-caleb-gridley-f7hyp" className="underline underline-offset-2 hover:text-gray-600 transition-colors">Charles Champagne Creative — Anointing the Artifice feature and Q&amp;A</a></li>
              <li><a href="https://www.theadvocate.com/baton_rouge/multimedia/photos/photos-videos-of-baton-rouge-gallerys-surreal-salon/collection_51ea8f54-9056-11ed-b76c-93aa23c64e2f.html" className="underline underline-offset-2 hover:text-gray-600 transition-colors">The Advocate — Surreal Salon coverage</a></li>
            </ul>
            <p className="mt-3 text-sm text-neutral-600">
              Full archive on <a href="https://popographer.com/press/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">popographer.com/press/</a>.
            </p>
          </section>

          <section id="exhibitions" aria-labelledby="exhibitions-h" className={`${styles.fadeUp} md:col-span-2`} style={{ animationDelay: ".3s" }}>
            <h2 id="exhibitions-h" className="text-sm font-semibold tracking-widest uppercase">EXHIBITIONS</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="font-medium">Anointing the Artifice (Solo)</p>
                <p>Shell Gallery, Arts Council of Greater Baton Rouge, Baton Rouge LA</p>
                <p>June 1 2024 to July 12 2024</p>
                <p className="mt-1 text-sm">
                  <a href="https://www.artsbr.org/events/anointing-the-artifice" className="underline underline-offset-2 hover:text-gray-600 transition-colors">ArtsBR event</a> ·{" "}
                  <a href="https://www.225batonrouge.com/things-to-do/week-baton-rouge-kids-art-fitness-pride-exhibit" className="underline underline-offset-2 hover:text-gray-600 transition-colors">225 Magazine</a> ·{" "}
                  <a href="https://www.charliefeet.com/leur-blog/anointing-the-artifice-by-caleb-gridley-f7hyp" className="underline underline-offset-2 hover:text-gray-600 transition-colors">CharlieFeet feature</a>
                </p>
              </div>
              <div>
                <p className="font-medium">Surreal Salon 15 (Group)</p>
                <p>Baton Rouge Gallery, Center for Contemporary Art, Baton Rouge LA</p>
                <p>January 1 2023 to February 1 2023</p>
                <p className="mt-1 text-sm">
                  <a href="https://www.theadvocate.com/baton_rouge/multimedia/photos/photos-videos-of-baton-rouge-gallerys-surreal-salon/collection_51ea8f54-9056-11ed-b76c-93aa23c64e2f.html" className="underline underline-offset-2 hover:text-gray-600 transition-colors">The Advocate</a> ·{" "}
                  <a href="https://design.lsu.edu/lsu-art-students-farris-and-wright-awarded-for-surreal-salon-15/" className="underline underline-offset-2 hover:text-gray-600 transition-colors">LSU School of Art</a>
                </p>
              </div>
            </div>
          </section>

          <section id="credits" aria-labelledby="credits-h" className={`${styles.fadeUp} md:col-span-2`} style={{ animationDelay: ".35s" }}>
            <h2 id="credits-h" className="text-sm font-semibold tracking-widest uppercase">CREDITS</h2>
            <ul className="mt-4 space-y-2">
              <li><a href="https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant" className="underline underline-offset-2 hover:text-gray-600 transition-colors">Discogs — Arcade Fire “Pink Elephant” release</a></li>
            </ul>
          </section>
        </div>

        <p className="mt-16 text-xs text-neutral-500">
          <strong>Legal note:</strong> Popographer® is the trade name of Popographer, LLC (Louisiana, USA).
        </p>

        {/* JSON-LD */}
        <Script
          id="identity-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
    </div>
  );
}
