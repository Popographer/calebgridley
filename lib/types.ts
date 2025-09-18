// /lib/types.ts

// ─────────────────────────────────────────────────────────────────────────────
// URL types (enforce https and trailing slashes where required)
// ─────────────────────────────────────────────────────────────────────────────
export type AbsoluteHttpsUrl = `https://${string}`;
export type TrailingSlashUrl = `${AbsoluteHttpsUrl}/`;
export type PathWithTrailingSlash = `/${string}/`;

// ─────────────────────────────────────────────────────────────────────────────
// Slugs
// Keep in sync with WORKS data and identity.ts POP_WORK_URLS keys.
// ─────────────────────────────────────────────────────────────────────────────
export type WorkSlug =
  | "caleb-gridley"
  | "body-of-work"
  | "not-warhol"
  | "augmentations"
  | "anointing-the-artifice"; // added to match identity POP_WORK_URLS

// ─────────────────────────────────────────────────────────────────────────────
// Media sources (loops)
// ─────────────────────────────────────────────────────────────────────────────
export interface LoopSource {
  webm1080?: AbsoluteHttpsUrl;
  webm720?: AbsoluteHttpsUrl;
  mp41080?: AbsoluteHttpsUrl;
  mp4720?: AbsoluteHttpsUrl;
  poster: AbsoluteHttpsUrl;
  duration: number; // seconds
  license: AbsoluteHttpsUrl;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero video or image (used for page hero blocks)
// ─────────────────────────────────────────────────────────────────────────────
export interface HeroVideo {
  kind: "image" | "video";
  src: AbsoluteHttpsUrl;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Work model
// ─────────────────────────────────────────────────────────────────────────────
export interface Work {
  slug: WorkSlug;
  title: string;
  description: string;

  /** Absolute canonical URL for this work (must end with "/") */
  canonicalUrl: TrailingSlashUrl;

  /** Hero media used in page header/preview */
  heroVideo: HeroVideo;

  /** Loop sources and poster for teaser playback */
  loop: LoopSource;

  /** Site-internal watch route (must start and end with "/") */
  watchPath: PathWithTrailingSlash;

  /** Optional fields used in UI captions (see ReelSnap) */
  role?: string;
  year?: string | number;
}
