// components/HomeClient.tsx
"use client";

import React from "react";
import Header from "./Header";
import ReelSnap from "./ReelSnap";
import SiteFooter from "./SiteFooter";
import { WORKS } from "../lib/works";
import type { Work, WorkSlug } from "../lib/types";
import { SoundContext, useSoundController } from "./SoundContext";

/** Desired order of reels on the homepage (stable, typed) */
const ORDER = [
  "caleb-gridley",
  "body-of-work",
  "not-warhol",
  "augmentations",
] as const satisfies Readonly<WorkSlug[]>;

export default function HomeClient() {
  const sound = useSoundController();

  // Build slug -> work map once
  const bySlug = React.useMemo(() => {
    const map = new Map<WorkSlug, Work>();
    for (const w of WORKS) map.set(w.slug, w);
    return map;
  }, []);

  // Deterministic reel list, already in ORDER (no sort needed)
  const REEL = React.useMemo<Work[]>(() => {
    const list = ORDER.map((slug) => bySlug.get(slug)).filter((w): w is Work => Boolean(w));

    // Dev-only visibility into missing slugs (no Node typings in client)
    if (typeof window !== "undefined") {
      const missing = ORDER.filter((slug) => !bySlug.has(slug));
      if (missing.length) {
        console.warn("[HomeClient] Missing works for slugs:", missing);
      }
    }

    return list;
  }, [bySlug]);

  return (
    <SoundContext.Provider value={sound}>
      <Header />
      <main id="content" className="bg-black">
        <ReelSnap
          items={REEL}
          showCaptions
          visibilityThreshold={0.62}
          crossfadeMs={140}
          autoAdvance
          wrapAround
          autoAdvanceSkipFooter
          footer={<SiteFooter />}
        />
      </main>
    </SoundContext.Provider>
  );
}
