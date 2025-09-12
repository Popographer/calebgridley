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

  // Build a stable ordering map once
  const orderIndex = React.useMemo(() => {
    const map = new Map<WorkSlug, number>();
    ORDER.forEach((slug, i) => map.set(slug, i));
    return map;
  }, []);

  // Deterministic reel list (sorted by ORDER)
  const REEL = React.useMemo<Work[]>(() => {
    const bySlug = new Map<WorkSlug, Work>();
    for (const w of WORKS) bySlug.set(w.slug, w);

    // Collect in order and filter out any missing slugs — with a type predicate
    const list = ORDER.map((slug) => bySlug.get(slug)).filter((w): w is Work => Boolean(w));

    // If you ever want to surface missing slugs locally, you can add a
    // non-TypeScript-checked console.warn here guarded by a runtime flag.
    // (Removed the `process.env` check to avoid Node typings in client code.)

    // Remove non-null assertions: fall back to a large rank if ever undefined
    const rank = (s: WorkSlug) => orderIndex.get(s) ?? Number.MAX_SAFE_INTEGER;
    return list.sort((a, b) => rank(a.slug) - rank(b.slug));
  }, [orderIndex]);

  return (
    <SoundContext.Provider value={sound}>
      <Header />
      <main className="bg-black">
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
