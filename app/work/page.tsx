// /app/work/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Header from "../../components/Header";
import JsonLd from "../../components/JsonLd";
import { WORKS, type Work } from "../../lib/works";
import {
  SITE_ORIGIN,
  POP_WORK_URLS,
  PERSON_ID,
  ORG_ID,
  ORG_NAME,
} from "../../lib/identity";

/** Static export: force SSG and disable ISR */
export const dynamic = "force-static";
export const revalidate = false;

// ────────────────────────────────────────────────────────────────────────────
// Metadata
// ────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Work | Caleb Gridley",
  description: "Selected works linking to their canonical Popographer pages.",
  alternates: { canonical: `${SITE_ORIGIN}/work/` },
  openGraph: {
    type: "website",
    url: `${SITE_ORIGIN}/work/`,
    title: "Work | Caleb Gridley",
    description: "Selected works linking to their canonical Popographer pages.",
  },
  robots: { index: true, follow: true },
};

// ────────────────────────────────────────────────────────────────────────────
// Content strings
// ────────────────────────────────────────────────────────────────────────────
const WORK_QUOTES: Partial<Record<Work["slug"], string>> = {
  "body-of-work":
    "“He's just a body. The rest is projection. Fabricated in the minds that watch.”",
  "not-warhol":
    "“A triptych of control, alteration, and erasure. Archetypes collapse. Originality dissolves. What remains is the ritual of influence.”",
  "augmentations":
    "“One hundred digital portraits fracture the self. Faces distort. Identities shift. At what point does recognition vanish and what remains when resemblance no longer applies?”",
};

const WORK_BLURBS: Partial<Record<Work["slug"], string>> = {
  "body-of-work":
    "The Popographer archive preserves Body of Work, Caleb Gridley’s first performance that treats the artist as artifact.",
  "not-warhol":
    "Popographer carries Not Warhol, Caleb Gridley sealed as record.",
  "augmentations":
    "Augmentations endures, Caleb Gridley carried into form by Popographer.",
};

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
function absOnSite(url?: string) {
  if (!url) return undefined;
  return /^https?:\/\//i.test(url) ? url : `${SITE_ORIGIN}${url}`;
}

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Remove undefined keys from objects/arrays (for clean JSON-LD). */
function compact<T>(val: T): T {
  if (Array.isArray(val)) {
    const arr: unknown[] = (val as unknown[]).map((v) => compact(v)).filter((v) => v !== undefined);
    return arr as unknown as T;
  }
  if (isPlainObject(val)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      const cleaned = compact(v);
      if (cleaned !== undefined) out[k] = cleaned;
    }
    return out as unknown as T;
  }
  return val;
}

// ────────────────────────────────────────────────────────────────────────────
function JsonLdWorkIndex({ items }: { items: Work[] }) {
  const json = compact({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}/work/#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_ORIGIN}/work/` },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_ORIGIN}/work/#webpage`,
        url: `${SITE_ORIGIN}/work/`,
        name: "Selected Works",
        isPartOf: { "@id": `${SITE_ORIGIN}/` },
        breadcrumb: { "@id": `${SITE_ORIGIN}/work/#breadcrumbs` },
        about: { "@id": PERSON_ID },
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_ORIGIN}/work/#selected-works`,
        name: "Selected Works",
        mainEntityOfPage: { "@id": `${SITE_ORIGIN}/work/#webpage` },
        itemListElement: items.map((w, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: absOnSite(w.canonicalUrl),
          name: w.title,
        })),
      },
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: ORG_NAME,
      },
    ],
  });

  return <JsonLd id="ld-work-index" data={json} />;
}

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────
export default function WorkPage() {
  const GRID = WORKS.filter((w) => w.slug !== "caleb-gridley");

  return (
    <>
      <Header />
      <main className="min-h-[100svh] bg-black text-white md:bg-white md:text-black">
        <JsonLdWorkIndex items={GRID} />

        <section className="px-6 pt-28 pb-16 safe-b">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Selected Works</h1>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GRID.map((w) => {
              const popUrl =
                (POP_WORK_URLS as Record<string, string | undefined>)[w.slug] || w.canonicalUrl;
              const quote = WORK_QUOTES[w.slug];
              const blurb = WORK_BLURBS[w.slug];
              const poster = w.loop?.poster || w.heroVideo?.src;

              return (
                <article
                  key={w.slug}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
                >
                  <a
                    href={popUrl}
                    target="_blank"
                    rel="external noopener noreferrer"
                    className="block group"
                    aria-label={`${w.title}: view on Popographer`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                      {poster ? (
                        <Image
                          src={poster}
                          alt={`${w.title} poster`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          priority={false}
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                  </a>

                  <div className="p-4">
                    <h2 className="text-base font-semibold tracking-wide uppercase">
                      <a
                        href={popUrl}
                        target="_blank"
                        rel="external noopener noreferrer"
                        className="hover:opacity-80"
                      >
                        {w.title}
                      </a>
                    </h2>

                    {quote && <p className="mt-2 text-sm italic text-neutral-700">{quote}</p>}

                    <p className="mt-2 text-sm text-neutral-700">
                      {blurb ? (
                        blurb
                      ) : (
                        <>
                          Explore context, stills, credits, and exhibition notes for{" "}
                          <strong>{w.title}</strong> on Popographer, the canonical archive for
                          Caleb Gridley’s moving image works.
                        </>
                      )}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
