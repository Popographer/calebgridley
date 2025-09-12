// /lib/types.ts

export type WorkSlug =
  | "caleb-gridley"
  | "body-of-work"
  | "not-warhol"
  | "augmentations";

export interface LoopSource {
  webm1080?: string;
  webm720?: string;
  mp41080?: string;
  mp4720?: string;
  poster: string;
  duration: number; // seconds
  license: string;
}

export interface HeroVideo {
  kind: "image" | "video";
  src: string;
}

export interface Work {
  slug: WorkSlug;
  title: string;
  description: string;
  canonicalUrl: string;
  heroVideo: HeroVideo;
  loop: LoopSource;
  watchPath: string;

  /** Optional fields used in UI captions (see ReelSnap) */
  role?: string;
  year?: string | number;
}
