// app/identity/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";

const HERO_URL =
  "https://cdn.calebgridley.com/augmentations-poster.webp"; // 1820x1080
const CARD_PNG =
  "https://cdn.calebgridley.com/caleb-gridley_identity-card_1080x1080.png";
const CARD_WEBP =
  "https://cdn.calebgridley.com/caleb-gridley_identity-card_1080x1080.webp";

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
  robots: { index: true, follow: true }
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
        name: "Augmentations poster",
        caption: "Augmentations poster by Caleb Gridley",
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
          "https://popographer.com/",
          "https://www.instagram.com/thepopographer/",
          "https://www.youtube.com/@popographer"
          // add ISNI and Wikidata URLs later
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
        url: "https://popographer.com/"
      }
    ]
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Caleb Gridley</h1>
      <p className="mt-3 text-base">
        American visual artist, photographer, and art film director. Also known as Popographer.
      </p>

      {/* Visible hero (LCP-optimized) */}
      <figure className="mt-6">
        <Image
          src={HERO_URL}
          alt="Augmentations poster by Caleb Gridley"
          width={1820}
          height={1080}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="w-full h-auto rounded-2xl shadow"
        />
        <figcaption className="mt-2 text-sm text-neutral-600">
          “Augmentations” poster. © Caleb Gridley.
        </figcaption>
      </figure>

      <section aria-labelledby="domains" className="mt-10">
        <h2 id="domains" className="text-xl font-semibold">Official domains</h2>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li><a href="https://calebgridley.com/" className="underline" rel="me">calebgridley.com</a></li>
          <li><a href="https://popographer.com/" className="underline">popographer.com</a></li>
        </ul>
      </section>

      <section aria-labelledby="socials" className="mt-8">
        <h2 id="socials" className="text-xl font-semibold">Socials</h2>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li><a href="https://www.instagram.com/thepopographer/" className="underline" rel="me">Instagram @thepopographer</a></li>
          <li><a href="https://www.youtube.com/@popographer" className="underline" rel="me">YouTube @popographer</a></li>
        </ul>
      </section>

      <section aria-labelledby="press" className="mt-8">
        <h2 id="press" className="text-xl font-semibold">Press and interviews</h2>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li><a href="https://canvasrebel.com/meet-caleb-gridley/" className="underline">CanvasRebel — “Meet Caleb Gridley”</a></li>
          <li><a href="https://www.225batonrouge.com/things-to-do/week-baton-rouge-kids-art-fitness-pride-exhibit" className="underline">225 Magazine — Week guide mention</a></li>
          <li><a href="https://www.charliefeet.com/leur-blog/anointing-the-artifice-by-caleb-gridley-f7hyp" className="underline">Charles Champagne Creative — Anointing the Artifice feature and Q&amp;A</a></li>
          <li><a href="https://www.theadvocate.com/baton_rouge/multimedia/photos/photos-videos-of-baton-rouge-gallerys-surreal-salon/collection_51ea8f54-9056-11ed-b76c-93aa23c64e2f.html" className="underline">The Advocate — Surreal Salon coverage</a></li>
        </ul>
        <p className="mt-3 text-sm">
          Full archive on <a href="https://popographer.com/press/" className="underline">popographer.com/press/</a>.
        </p>
      </section>

      <section aria-labelledby="exhibitions" className="mt-8">
        <h2 id="exhibitions" className="text-xl font-semibold">Exhibitions</h2>
        <div className="mt-3 space-y-4">
          <div>
            <p className="font-medium">Anointing the Artifice (Solo)</p>
            <p>Shell Gallery, Arts Council of Greater Baton Rouge, Baton Rouge LA</p>
            <p>June 1 2024 to July 12 2024</p>
            <p className="mt-1 text-sm">
              <a href="https://www.artsbr.org/events/anointing-the-artifice" className="underline">ArtsBR event</a> ·{" "}
              <a href="https://www.225batonrouge.com/things-to-do/week-baton-rouge-kids-art-fitness-pride-exhibit" className="underline">225 Magazine</a> ·{" "}
              <a href="https://www.charliefeet.com/leur-blog/anointing-the-artifice-by-caleb-gridley-f7hyp" className="underline">CharlieFeet feature</a>
            </p>
          </div>
          <div>
            <p className="font-medium">Surreal Salon 15 (Group)</p>
            <p>Baton Rouge Gallery, Center for Contemporary Art, Baton Rouge LA</p>
            <p>January 1 2023 to February 1 2023</p>
            <p className="mt-1 text-sm">
              <a href="https://www.theadvocate.com/baton_rouge/multimedia/photos/photos-videos-of-baton-rouge-gallerys-surreal-salon/collection_51ea8f54-9056-11ed-b76c-93aa23c64e2f.html" className="underline">The Advocate</a> ·{" "}
              <a href="https://design.lsu.edu/lsu-art-students-farris-and-wright-awarded-for-surreal-salon-15/" className="underline">LSU School of Art</a>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="credits" className="mt-8">
        <h2 id="credits" className="text-xl font-semibold">Credits</h2>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li><a href="https://www.discogs.com/release/34065559-Arcade-Fire-Pink-Elephant" className="underline">Discogs — Arcade Fire “Pink Elephant” release</a></li>
        </ul>
      </section>

      <p className="mt-10 text-sm">
        <strong>Legal note:</strong> Popographer® is the trade name of Popographer, LLC (Louisiana, USA).
      </p>

      {/* JSON-LD */}
      <Script id="identity-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
