// components/ReelSnap.jsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Video from "./Video";
import { SoundContext } from "./SoundContext";
import { POP_WORK_URLS } from "../lib/identity";

function buildSources(loop) {
  if (!loop) return [];
  const s = [];
  if (loop.webm1080) s.push({ src: loop.webm1080, type: "video/webm" });
  if (loop.mp41080) s.push({ src: loop.mp41080, type: "video/mp4" });
  else if (loop.mp4720) s.push({ src: loop.mp4720, type: "video/mp4" });
  if (loop.webm720) s.push({ src: loop.webm720, type: "video/webm", media: "(max-width: 900px)" });
  if (loop.mp4720) s.push({ src: loop.mp4720, type: "video/mp4", media: "(max-width: 900px)" });
  return s;
}

const num = (i) => `${String(i + 1).padStart(2, "0")}`;

function TitleAnimated({ text }) {
  const chars = React.useMemo(() => (text || "").toUpperCase().split(""), [text]);
  return (
    <div className="group-data-[active=true]:opacity-100 opacity-0 transition-opacity duration-150">
      {chars.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="inline-block translate-y-1 scale-[0.98] opacity-0 transition-all duration-300 group-data-[active=true]:translate-y-0 group-data-[active=true]:scale-100 group-data-[active=true]:opacity-100"
          style={{ transitionDelay: `${i * 22}ms` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

export default function ReelSnap({
  items,
  showCaptions = true,
  visibilityThreshold = 0.6,
  crossfadeMs = 140,
  footer = null,
}) {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const videoRefs = useRef([]);
  const { muted } = React.useContext(SoundContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [crossfade, setCrossfade] = useState(false);

  const toIndex = useCallback((idx) => {
    const sec = sectionRefs.current[idx];
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const root = containerRef.current ?? null;
    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1,
          bestRatio = 0;
        for (const e of entries) {
          const i = Number(e.target.getAttribute("data-index"));
          if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            bestIdx = i;
          }
        }
        if (bestIdx >= 0) {
          if (bestRatio >= visibilityThreshold) {
            setActiveIndex((prev) => {
              if (prev !== bestIdx) {
                setCrossfade(true);
                setTimeout(() => setCrossfade(false), crossfadeMs);
              }
              return bestIdx;
            });
          }
          videoRefs.current.forEach((el, idx) => {
            if (!el) return;
            if (idx === bestIdx && bestRatio >= visibilityThreshold) {
              el.muted = true; // keep silent autoplay consistent
              el.play().catch(() => {});
            } else if (!el.paused) {
              el.pause();
            }
          });
        }
      },
      { root, threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    sectionRefs.current.forEach((sec) => sec && io.observe(sec));
    return () => io.disconnect();
  }, [visibilityThreshold, crossfadeMs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentIndex = () => {
      const top = el.scrollTop;
      let best = 0,
        bestDist = Infinity;
      sectionRefs.current.forEach((sec, i) => {
        const dist = Math.abs((sec?.offsetTop ?? 0) - top);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    const onKey = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const idx = currentIndex();
      const max = (items?.length || 1) - 1;
      if (e.key === "ArrowDown" || e.key === "PageDown") toIndex(Math.min(max, idx + 1));
      else if (e.key === "ArrowUp" || e.key === "PageUp") toIndex(Math.max(0, idx - 1));
      else if (e.key === "Home") toIndex(0);
      else if (e.key === "End") toIndex(max);
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [items?.length, toIndex]);

  useEffect(() => {
    const v0 = videoRefs.current[0];
    if (v0) setTimeout(() => v0.play().catch(() => {}), 60);
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const v = videoRefs.current[activeIndex];
        v?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [activeIndex]);

  const panels = useMemo(() => items || [], [items]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth outline-none bg-black no-scrollbar"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-150 ${
          crossfade ? "opacity-20" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* bottom-right index */}
      <div className="group fixed bottom-6 right-6 z-40 select-none flex flex-col items-end gap-1">
        <button
          className="pointer-events-auto text-white/90 font-mono text-base tracking-[0.15em] transition-opacity group-hover:opacity-0"
          aria-label={`Current section ${activeIndex + 1}`}
          onClick={() => toIndex(activeIndex)}
        >
          {num(activeIndex)}
        </button>
        <div className="pointer-events-auto hidden group-hover:flex flex-col items-end gap-1">
          {panels.map((_, i) => (
            <button
              key={i}
              onClick={() => toIndex(i)}
              className={`font-mono text-base tracking-[0.15em] transition ${
                i === activeIndex ? "text-white font-semibold" : "text-white/60 hover:text-white/90"
              }`}
              aria-label={`Go to section ${i + 1}`}
            >
              {num(i)}
            </button>
          ))}
        </div>
      </div>

      {panels.map((it, i) => {
        const loop = it.loop;
        const showTitle = showCaptions && it.slug !== "caleb-gridley";
        const popUrl = POP_WORK_URLS[it.slug];
        return (
          <section
            key={it.slug}
            data-index={i}
            data-active={i === activeIndex}
            ref={(el) => (sectionRefs.current[i] = el)}
            className="group relative reel-section w-full snap-start"
          >
            <Video
              tagRef={(el) => (videoRefs.current[i] = el)}
              poster={loop?.poster || it.heroVideo?.src}
              className="h-full w-full"
              sources={buildSources(loop)}
              loop
              preload={i === 0 ? "auto" : "metadata"} // eager on first
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Title/meta (uppercased) */}
            {showTitle && (
              <div className="absolute title-pad md:bottom-16 left-6 right-6 text-white">
                <h2 className="text-4xl md:text-6xl font-semibold drop-shadow uppercase">
                  {popUrl ? (
                    <a
                      href={popUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-block hover:opacity-90 focus:opacity-90 focus:outline-none"
                      aria-label={`${it.title} — view on Popographer`}
                    >
                      <TitleAnimated text={it.title} />
                    </a>
                  ) : (
                    <TitleAnimated text={it.title} />
                  )}
                </h2>
                {(it.role || it.year) && (
                  <p className="mt-2 text-neutral-200">
                    {it.role}
                    {it.year ? ` • ${it.year}` : ""}
                  </p>
                )}
              </div>
            )}
          </section>
        );
      })}

      {footer ? <section className="relative w-full snap-start bg-black safe-b">{footer}</section> : null}
    </div>
  );
}
