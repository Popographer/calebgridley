// components/HomeClient.jsx
"use client";

import Header from "./Header";
import ReelSnap from "./ReelSnap";
import SiteFooter from "./SiteFooter";
import { WORKS } from "../lib/works";
import { SoundContext, useSoundController } from "./SoundContext";

export default function HomeClient() {
  const sound = useSoundController();

  // Order: caleb-gridley (landing), then body-of-work, not-warhol, augmentations
  const REEL = [
    "caleb-gridley",
    "body-of-work",
    "not-warhol",
    "augmentations",
  ]
    .map((slug) => WORKS.find((w) => w.slug === slug))
    .filter(Boolean);

  return (
    <SoundContext.Provider value={sound}>
      <Header />
      {/* Main can be plain now; the inner scroller handles snap & footer */}
      <main className="bg-black">
        <ReelSnap
          items={REEL}
          showCaptions
          visibilityThreshold={0.62}
          crossfadeMs={140}
          footer={<SiteFooter />}
        />
      </main>
    </SoundContext.Provider>
  );
}
