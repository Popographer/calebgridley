// /lib/works.ts
import type { Work, WorkSlug, LoopSource } from "./types";

/** Export types here too so pages can import from either module */
export type { Work, WorkSlug, LoopSource };

// ── Works data (absolute canonical URLs; trailing slashes everywhere)
export const WORKS: Readonly<Work[]> = [
  {
    slug: "caleb-gridley",
    title: "Caleb Gridley",
    description: "Landing/profile teaser loop.",
    canonicalUrl: "https://calebgridley.com/work/caleb-gridley/",
    heroVideo: {
      kind: "image",
      src: "https://cdn.calebgridley.com/caleb-gridley-poster.webp",
    },
    loop: {
      webm1080: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm",
      webm720:  "https://cdn.calebgridley.com/caleb-gridley-loop-720.webm",
      mp4720:   "https://cdn.calebgridley.com/caleb-gridley-loop-720.mp4",
      poster:   "https://cdn.calebgridley.com/caleb-gridley-poster.webp",
      duration: 17,
      license:  "https://popographer.com/licensing/",
    },
    watchPath: "/work/caleb-gridley/",
  },
  {
    slug: "body-of-work",
    title: "Body of Work",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "https://calebgridley.com/work/body-of-work/",
    heroVideo: {
      kind: "image",
      src: "https://cdn.calebgridley.com/body-of-work-poster.webp",
    },
    loop: {
      webm1080: "https://cdn.calebgridley.com/body-of-work-loop-1080.webm",
      webm720:  "https://cdn.calebgridley.com/body-of-work-loop-720.webm",
      mp41080:  "https://cdn.calebgridley.com/body-of-work-loop-1080.mp4",
      mp4720:   "https://cdn.calebgridley.com/body-of-work-loop-720.mp4",
      poster:   "https://cdn.calebgridley.com/body-of-work-poster.webp",
      duration: 10,
      license:  "https://popographer.com/licensing/",
    },
    watchPath: "/work/body-of-work/",
  },
  {
    slug: "not-warhol",
    title: "Not Warhol",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "https://calebgridley.com/work/not-warhol/",
    heroVideo: {
      kind: "image",
      src: "https://cdn.calebgridley.com/not-warhol-poster.webp",
    },
    loop: {
      webm1080: "https://cdn.calebgridley.com/not-warhol-loop-1080.webm",
      webm720:  "https://cdn.calebgridley.com/not-warhol-loop-720.webm",
      mp41080:  "https://cdn.calebgridley.com/not-warhol-loop-1080.mp4",
      mp4720:   "https://cdn.calebgridley.com/not-warhol-loop-720.mp4",
      poster:   "https://cdn.calebgridley.com/not-warhol-poster.webp",
      duration: 19,
      license:  "https://popographer.com/licensing/",
    },
    watchPath: "/work/not-warhol/",
  },
  {
    slug: "augmentations",
    title: "Augmentations",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "https://calebgridley.com/work/augmentations/",
    heroVideo: {
      kind: "image",
      src: "https://cdn.calebgridley.com/augmentations-poster.webp",
    },
    loop: {
      webm1080: "https://cdn.calebgridley.com/augmentations-loop-1080.webm",
      webm720:  "https://cdn.calebgridley.com/augmentations-loop-720.webm",
      mp41080:  "https://cdn.calebgridley.com/augmentations-loop-1080.mp4",
      mp4720:   "https://cdn.calebgridley.com/augmentations-loop-720.mp4",
      poster:   "https://cdn.calebgridley.com/augmentations-poster.webp",
      duration: 19,
      license:  "https://popographer.com/licensing/",
    },
    watchPath: "/work/augmentations/",
  },
] as const;

// ── Helper: lookup by slug
export const getWorkBySlug = (slug: WorkSlug) =>
  WORKS.find((w) => w.slug === slug);

// ── Helpers: index + circular navigation (for auto-advance + looping)
export const getIndexBySlug = (slug: WorkSlug) =>
  WORKS.findIndex((w) => w.slug === slug);

export const nextWorkSlug = (current: WorkSlug): WorkSlug | undefined => {
  const i = getIndexBySlug(current);
  if (i < 0) return undefined;
  return WORKS[(i + 1) % WORKS.length].slug;
};

export const prevWorkSlug = (current: WorkSlug): WorkSlug | undefined => {
  const i = getIndexBySlug(current);
  if (i < 0) return undefined;
  return WORKS[(i - 1 + WORKS.length) % WORKS.length].slug;
};
