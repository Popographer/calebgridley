// /app/page.tsx
import type { Metadata } from "next";
import HomeClient from "../components/HomeClient";
import JsonLd from "../components/JsonLd";
import { WORKS } from "../lib/works";
import type { Work, LoopSource } from "../lib/types";
import {
  SITE_ORIGIN,
  PERSON_ID,
  PERSON_NAME,
  PERSON_ROLES,
  PERSON_SAME_AS,
  emailForSchema,
  ORG_ID,
  ORG_NAME,
  ORG_LOGO_URL,
  ORG_LOGO_ID,
} from "../lib/identity";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = {
  title: `${PERSON_NAME} — Artist & Director`,
  description:
    "Visual artist, photographer, art film director. Selected works and links to Popographer.",
  alternates: { canonical: `${SITE_ORIGIN}/` },
  openGraph: {
    type: "website",
    url: `${SITE_ORIGIN}/`,
    title: `${PERSON_NAME} — Artist & Director`,
    description:
      "Visual artist, photographer, art film director. Selected works and links to Popographer.",
  },
  robots: { index: true, follow: true },
};

function absOnSite(url?: string | null): string | undefined {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `${SITE_ORIGIN}${url}`;
}

function isoWithTZ(d: Date = new Date()): string {
  const pad2 = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  const tz = -d.getTimezoneOffset();
  const sign = tz >= 0 ? "+" : "-";
  const hh = pad2(tz / 60);
  const mm = pad2(tz % 60);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}${sign}${hh}:${mm}`;
}

function encodings(
  ...sources: Array<{ url?: string | null; type?: string | null } | undefined>
) {
  const arr: Array<{ "@type": "MediaObject"; contentUrl: string; encodingFormat?: string }> = [];
  for (const s of sources) {
    if (s?.url) {
      arr.push({ "@type": "MediaObject", contentUrl: s.url, encodingFormat: s.type || undefined });
    }
  }
  return arr;
}

function compact<T>(val: T): T {
  if (Array.isArray(val as unknown)) {
    const arr = (val as unknown as unknown[])
      .map((v) => compact(v))
      .filter((v) => v !== undefined);
    return arr as unknown as T;
  }
  if (val && typeof val === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      const cleaned = compact(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out as unknown as T;
  }
  return val;
}

function ProfileGraph() {
  const jsonld = compact({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebPage", "ProfilePage"],
        "@id": `${SITE_ORIGIN}#webpage`,
        "url": `${SITE_ORIGIN}/`,
        "name": `${PERSON_NAME} — Artist & Director`,
        "isPartOf": { "@id": `${SITE_ORIGIN}#website` },
        "breadcrumb": { "@id": `${SITE_ORIGIN}#breadcrumbs` },
        "mainEntity": { "@id": PERSON_ID }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}#breadcrumbs`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_ORIGIN}/` },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About @ Popographer",
            "item": "https://popographer.com/about/"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        "name": ORG_NAME,
        "url": "https://popographer.com/",
        "logo": {
          "@type": "ImageObject",
          "@id": ORG_LOGO_ID,
          "url": ORG_LOGO_URL
        }
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        "name": PERSON_NAME,
        "url": `${SITE_ORIGIN}/`,
        "worksFor": { "@id": ORG_ID },
        "sameAs": PERSON_SAME_AS,
        "email": emailForSchema,
        "hasOccupation": PERSON_ROLES.map((r) => ({ "@type": "Occupation", "name": r })),
        "mainEntityOfPage": { "@id": `${SITE_ORIGIN}#webpage` }
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}#selected-works`,
        "name": "Selected Works",
        "itemListElement": (WORKS as Work[]).map((w, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": absOnSite(w.canonicalUrl),
          "name": w.title
        }))
      }
    ]
  });

  return <JsonLd id="ld-profile" data={jsonld} />;
}

function VideosGraph() {
  const graph: Array<Record<string, unknown>> = [];

  const publisher = {
    "@type": "Organization",
    "@id": ORG_ID,
    "logo": { "@id": ORG_LOGO_ID }
  };

  graph.push(
    compact({
      "@type": "VideoObject",
      "@id": `${SITE_ORIGIN}#landing-video`,
      "name": `${PERSON_NAME} — Landing Loop`,
      "description": "Landing/profile loop.",
      "inLanguage": "en",
      "uploadDate": isoWithTZ(),
      "duration": "PT17S",
      "thumbnailUrl": absOnSite("/loops/caleb-gridley-poster.webp"),
      "mainEntityOfPage": { "@id": `${SITE_ORIGIN}#webpage` },
      "publisher": publisher,
      "creator": { "@id": PERSON_ID },
      "author": { "@id": PERSON_ID },
      "copyrightHolder": { "@id": PERSON_ID },
      "license": "https://popographer.com/licensing/",
      "contentUrl": "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm",
      "encoding": encodings(
        { url: "https://cdn.calebgridley.com/caleb-gridley-loop-720.mp4", type: "video/mp4" },
        { url: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm", type: "video/webm" },
        { url: "https://cdn.calebgridley.com/caleb-gridley-loop-720.webm", type: "video/webm" }
      )
    })
  );

  for (const w of WORKS as Work[]) {
    const v: LoopSource = w.loop;

    const primaryWebm = v.webm1080 || v.webm720;
    const primaryMp4 = v.mp4720 || v.mp41080;

    const enc = encodings(
      { url: v.mp4720, type: "video/mp4" },
      { url: v.mp41080, type: "video/mp4" },
      { url: v.webm1080, type: "video/webm" },
      { url: v.webm720, type: "video/webm" }
    );

    graph.push(
      compact({
        "@type": "VideoObject",
        "@id": `${SITE_ORIGIN}${w.canonicalUrl}#video`,
        "name": w.title,
        "description": w.description,
        "inLanguage": "en",
        "uploadDate": isoWithTZ(),
        "duration": v.duration ? `PT${v.duration}S` : undefined,
        "thumbnailUrl": absOnSite(v.poster),
        "mainEntityOfPage": { "@id": `${SITE_ORIGIN}${w.canonicalUrl}` },
        "publisher": publisher,
        "creator": { "@id": PERSON_ID },
        "author": { "@id": PERSON_ID },
        "copyrightHolder": { "@id": PERSON_ID },
        "license": v.license || "https://popographer.com/licensing/",
        "contentUrl": primaryWebm || primaryMp4,
        "encoding": enc
      })
    );
  }

  return <JsonLd id="ld-videos" data={{ "@context": "https://schema.org", "@graph": graph }} />;
}

export default function Page() {
  return (
    <>
      <ProfileGraph />
      <VideosGraph />
      <HomeClient />
    </>
  );
}
