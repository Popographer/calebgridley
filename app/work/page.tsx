// app/work/page.jsx
import Header from "../../components/Header";
import { WORKS } from "../../lib/works";
import { POP_WORK_URLS } from "../../lib/identity";

export const metadata = {
  title: "Work — Caleb Gridley",
  description: "Selected works linking to their canonical Popographer pages.",
  alternates: { canonical: "https://calebgridley.com/work/" },
  openGraph: {
    type: "website",
    url: "https://calebgridley.com/work/",
    title: "Work — Caleb Gridley",
    description: "Selected works linking to their canonical Popographer pages."
  },
  robots: { index: true, follow: true }
};

// Quotes to display under each title
const WORK_QUOTES = {
  "body-of-work":
    "“He's just a body. The rest is projection. Fabricated in the minds that watch.”",
  "not-warhol":
    "“A triptych of control, alteration, and erasure. Archetypes collapse. Originality dissolves. What remains is the ritual of influence.”",
  "augmentations":
    "“One hundred digital portraits fracture the self. Faces distort. Identities shift. At what point does recognition vanish and what remains when resemblance no longer applies?”"
};

// Replacement blurbs for the generic “Explore context…” line
const WORK_BLURBS = {
  "body-of-work":
    "The Popographer archive preserves Body of Work, Caleb Gridley’s first performance that treats the artist as artifact.",
  "not-warhol":
    "Popographer carries Not Warhol, Caleb Gridley sealed as record.",
  "augmentations":
    "Augmentations endures, Caleb Gridley carried into form by Popographer."
};

export default function WorkPage() {
  // Exclude the landing reel (Caleb Gridley)
  const GRID = WORKS.filter((w) => w.slug !== "caleb-gridley");

  return (
    <>
      <Header />
      <main className="min-h-[100svh] bg-black text-white md:bg-white md:text-black">
        <section className="px-6 pt-28 pb-16 safe-b">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Selected Works</h1>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GRID.map((w) => {
              const popUrl = POP_WORK_URLS[w.slug] || w.canonicalUrl;
              const quote = WORK_QUOTES[w.slug];
              const blurb = WORK_BLURBS[w.slug];
              return (
                <article
                  key={w.slug}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
                >
                  <a
                    href={popUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                    aria-label={`${w.title} — view on Popographer`}
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-200">
                      <img
                        src={w.loop?.poster || w.heroVideo?.src}
                        alt={`${w.title} poster`}
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  </a>

                  <div className="p-4">
                    <h2 className="text-base font-semibold tracking-wide uppercase">
                      <a
                        href={popUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80"
                      >
                        {w.title}
                      </a>
                    </h2>

                    {quote && (
                      <p className="mt-2 text-sm italic text-neutral-700">
                        {quote}
                      </p>
                    )}

                    {/* Replace generic line with per-work blurb when available */}
                    <p className="mt-2 text-sm text-neutral-700">
                      {blurb
                        ? blurb
                        : <>Explore context, stills, credits, and exhibition notes for <strong>{w.title}</strong> on Popographer — the canonical archive for Caleb Gridley’s moving-image works.</>}
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
