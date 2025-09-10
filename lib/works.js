// /lib/works.js
// Reel order (as rendered on home): Caleb Gridley → Body of Work → Not Warhol → Augmentations

export const WORKS = [
  // 1) Caleb Gridley — landing
  {
    slug: "caleb-gridley",
    title: "Caleb Gridley",
    description: "Landing/profile teaser loop.",
    canonicalUrl: "/work/caleb-gridley/",
    heroVideo: { kind: "image", src: "/loops/caleb-gridley-poster.webp" },
    loop: {
      // CDN primary sources
      webm1080: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.webm", // 17s · 15.7 MB
      webm720:  "https://cdn.calebgridley.com/caleb-gridley-loop-720.webm",  // 17s · 3.73 MB
      // Prefer smaller MP4 fallback for Safari/iOS
      mp4720:   "https://cdn.calebgridley.com/caleb-gridley-loop-720.mp4",   // 17s · 7.48 MB
      // Optional (heavy): mp41080
      // mp41080: "https://cdn.calebgridley.com/caleb-gridley-loop-1080.mp4", // 17s · 94 MB
      poster:   "/loops/caleb-gridley-poster.webp", // posters stay on site
      duration: 17,
      license:  "https://popographer.com/licensing/"
    },
    watchPath: "/work/caleb-gridley/"
  },

  // 2) Body of Work
  {
    slug: "body-of-work",
    title: "Body of Work",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "/work/body-of-work/",
    heroVideo: { kind: "image", src: "/loops/body-of-work-poster.webp" },
    loop: {
      webm1080: "https://cdn.calebgridley.com/body-of-work-loop-1080.webm", // 10s · 11.4 MB
      webm720:  "https://cdn.calebgridley.com/body-of-work-loop-720.webm",  // 10s · 1.25 MB
      mp41080:  "https://cdn.calebgridley.com/body-of-work-loop-1080.mp4",  // 10s · 6.53 MB
      mp4720:   "https://cdn.calebgridley.com/body-of-work-loop-720.mp4",   // 10s · 3.33 MB
      poster:   "/loops/body-of-work-poster.webp",
      duration: 10,
      license:  "https://popographer.com/licensing/"
    },
    watchPath: "/work/body-of-work/"
  },

  // 3) Not Warhol
  {
    slug: "not-warhol",
    title: "Not Warhol",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "/work/not-warhol/",
    heroVideo: { kind: "image", src: "/loops/not-warhol-poster.webp" },
    loop: {
      webm1080: "https://cdn.calebgridley.com/not-warhol-loop-1080.webm", // 19s · 19.7 MB
      webm720:  "https://cdn.calebgridley.com/not-warhol-loop-720.webm",  // 19s · 4.30 MB
      mp41080:  "https://cdn.calebgridley.com/not-warhol-loop-1080.mp4",  // 19s · 13.2 MB
      mp4720:   "https://cdn.calebgridley.com/not-warhol-loop-720.mp4",   // 19s · 7.10 MB
      poster:   "/loops/not-warhol-poster.webp",
      duration: 19,
      license:  "https://popographer.com/licensing/"
    },
    watchPath: "/work/not-warhol/"
  },

  // 4) Augmentations
  {
    slug: "augmentations",
    title: "Augmentations",
    description: "Teaser loop; full piece on watch page.",
    canonicalUrl: "/work/augmentations/",
    heroVideo: { kind: "image", src: "/loops/augmentations-poster.webp" },
    loop: {
      webm1080: "https://cdn.calebgridley.com/augmentations-loop-1080.webm", // 19s · 15.7 MB
      webm720:  "https://cdn.calebgridley.com/augmentations-loop-720.webm",  // 19s · 2.90 MB
      mp41080:  "https://cdn.calebgridley.com/augmentations-loop-1080.mp4",  // 19s · 12.5 MB
      mp4720:   "https://cdn.calebgridley.com/augmentations-loop-720.mp4",   // 19s · 8.16 MB
      poster:   "/loops/augmentations-poster.webp",
      duration: 19,
      license:  "https://popographer.com/licensing/"
    },
    watchPath: "/work/augmentations/"
  }
];
