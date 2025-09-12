// app/page.jsx
import Script from "next/script";
import HomeClient from "../components/HomeClient";
import { WORKS } from "../lib/works";
import {
  PERSON_ID, PERSON_NAME, PERSON_ROLES, PERSON_SAME_AS,
  PERSON_CONTACT_EMAIL, ORG_ID, ORG_NAME, ORG_LOGO_URL
} from "../lib/identity";

// ────────────────────────────────────────────────────────────────────────────
// Metadata (server) — App Router safe
// ────────────────────────────────────────────────────────────────────────────
export const metadata = {
  title: `${PERSON_NAME} — Artist & Director`,
  description:
    "Visual artist, photographer, art film director. Selected works and links to Popographer.",
  alternates: { canonical: "https://calebgridley.com/" },
  openGraph: {
    type: "website",
    url: "https://calebgridley.com/",
    title: `${PERSON_NAME} — Artist & Director`,
    description:
      "Visual artist, photographer, art film director. Selected works and links to Popographer.",
  },
  robots: { index: true, follow: true }
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
const SITE = "https://calebgridley.com";

/** Prefix relative (site-hosted) paths with the site origin. */
const absOnSite = (url) => {
  if (!url) return url;
  return /^https?:\/\//i.test(url) ? url : `${SITE}${url}`;
};

/** ISO string with local timezone offset (e.g., 2025-09-07T12:00:00-05:00). */
function isoWithTZ(d = new Date()) {
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const hh = pad(tz / 60);
  const mm = pad(tz % 60);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}${sign}${hh}:${mm}`;
}

/** Build a schema.org encoding array from multiple sources (keeps exact URLs). */
function encodings(...sources) {
  const arr = [];
  for (const s of sources) {
    if (s && s.url) {
      arr.push({ "@type": "MediaObject", contentUrl: s.url, encodingFormat: s.type });
    }
  }
  return arr;
}

/** Ensure email is mailto: for schema. */
const emailForSchema = PERSON_CONTACT_EMAIL?.startsWith("mailto:")
  ? PERSON_CONTACT_EMAIL
  : `mailto:${PERSON_CONTACT_EMAIL}`;

// ────────────────────────────────────────────────────────────────────────────
// Profile + Breadcrumbs + Organization + Person (JSON-LD)
// ────────────────────────────────────────────────────────────────────────────
function JsonLdProfile() {
  const jsonld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "ProfilePage"],
        "@id": `${SITE}/#webpage`,
        url: `${SITE}/`,
        name: `${PERSON_NAME} — Artist & Director`,
        isPartOf: { "@id": `${SITE}/` },
        breadcrumb: { "@id": `${SITE}/#breadcrumbs` },
        mainEntity: { "@id": PERSON_ID }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "About @ Popographer", item: "https://popographer.com/about/" }
        ]
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: ORG_NAME,
        url: "https://popographer.com/",
        logo: {
          "@type": "ImageObject",
          "@id": "https://popographer.com/#logo",
          url: ORG_LOGO_URL
        }
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: PERSON_NAME,
        url: `${SITE}/`,
        worksFor: { "@id": ORG_ID },
        sameAs: PERSON_SAME_AS,
        email: emailForSchema,
        hasOccupation: PERSON_ROLES.map((r) => ({ "@type": "Occupation", name: r })),
        mainEntityOfPage: { "@id": `${SITE}/#webpage` }
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/#selected-works`,
        name: "Selected Works",
        itemListElement: WORKS.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absOnSite(w.canonicalUrl),
          name: w.title
        }))
      }
    ]
  };

  return (
    <Script id="ld-profile" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(jsonld)}
    </Script>
  );
}

// ────────────────────────────────────────────────────────────────────────────
/* Expanded VideoObject schema for landing + each work
   - thumbnailUrl: on SITE
   - contentUrl/encoding: use the exact CDN URLs in WORKS.loop.webm / WORKS.loop.mp4
   - uploadDate: with timezone
   - includes license + copyrightHolder
*/
// ────────────────────────────────────────────────────────────────────────────
function JsonLdVideos() {
  const graph = [];

  // Keep publisher minimal; the full Organization (with logo URL) is defined in JsonLdProfile()
  const publisher = { "@type": "Organization", "@id": ORG_ID };

  // Landing (Caleb Gridley) — 1080 WebM primary; also list 720 WebM + 720 MP4
  graph.push({
    "@type": "VideoObject",
    "@id": `${SITE}/#landing-video`,
    name: `${PERSON_NAME} — Landing Loop`,
    description: "Landing/profile loop.",
    inLanguage: "en",
    uploadDate: isoWithTZ(),
    duration: "PT17S",
    thumbnailUrl: absOnSite("/loops/caleb-gridley-poster.webp"),
    mainEntityOfPage: { "@id": `${SITE}/#webpage` },
    publisher,
    creator: { "@id": PERSON_ID },
    author:  { "@id": PERSON_ID },
    copyrightHolder: { "@id": PERSON_ID },
    license: "https://popographer.com/licensing/",
    contentUrl: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm",
    encoding: encodings(
      { url: "https://cdn.calebgridley.com/caleb-gridley-loop-720.mp4",  type: "video/mp4"  },
      { url: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm", type: "video/webm" },
      { url: "https://cdn.calebgridley.com/caleb-gridley-loop-720.webm",  type: "video/webm" }
    )
  });

  // Works — prefer webm1080 -> webm720 -> mp4720 -> mp41080; list all encodes present
  for (const w of WORKS) {
    const v = w.loop || {};
    const primaryWebm = v.webm1080 || v.webm720; // (expected absolute CDN URL)
    const primaryMp4  = v.mp4720 || v.mp41080;   // prefer smaller MP4 for Safari

    const enc = encodings(
      { url: v.mp4720,   type: "video/mp4"  },
      { url: v.mp41080,  type: "video/mp4"  },
      { url: v.webm1080, type: "video/webm" },
      { url: v.webm720,  type: "video/webm" }
    );

    graph.push({
      "@type": "VideoObject",
      "@id": `${SITE}${w.canonicalUrl}#video`,
      name: w.title,
      description: w.description,
      inLanguage: "en",
      uploadDate: isoWithTZ(),
      duration: v.duration ? `PT${v.duration}S` : undefined,
      thumbnailUrl: absOnSite(v.poster),
      mainEntityOfPage: { "@id": `${SITE}${w.canonicalUrl}` },
      publisher,
      creator: { "@id": PERSON_ID },
      author:  { "@id": PERSON_ID },
      copyrightHolder: { "@id": PERSON_ID },
      license: v.license || "https://popographer.com/licensing/",
      contentUrl: primaryWebm || primaryMp4,
      encoding: enc
    });
  }

  return (
    <Script id="ld-videos" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
    </Script>
  );
}

export default function Page() {
  return (
    <>
      <JsonLdProfile />
      <JsonLdVideos />
      <HomeClient />
    </>
  );
}
