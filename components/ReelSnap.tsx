// components/ReelSnap.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Video, { type VideoSource } from "./Video";
import { POP_WORK_URLS } from "../lib/identity";
import type { Work, LoopSource } from "../lib/types";

// Build <source> list for <video>
function buildSources(loop?: LoopSource): VideoSource[] {
  if (!loop) return [];
  const s: VideoSource[] = [];
  if (loop.webm1080) s.push({ src: loop.webm1080, type: "video/webm" });
  if (loop.mp41080) s.push({ src: loop.mp41080, type: "video/mp4" });
  else if (loop.mp4720) s.push({ src: loop.mp4720, type: "video/mp4" });
  if (loop.webm720) s.push({ src: loop.webm720, type: "video/webm", media: "(max-width: 900px)" });
  if (loop.mp4720) s.push({ src: loop.mp4720, type: "video/mp4", media: "(max-width: 900px)" });
  return s;
}

const num = (i: number) => `${String(i + 1).padStart(2, "0")}`;

function TitleAnimated({ text }: { text?: string }) {
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

export interface ReelSnapProps {
  items?: Work[];
  showCaptions?: boolean;
  visibilityThreshold?: number;
  crossfadeMs?: number;
  footer?: React.ReactNode;
  autoAdvance?: boolean;
  wrapAround?: boolean;
  autoAdvanceSkipFooter?: boolean;
}

export default function ReelSnap({
  items,
  showCaptions = true,
  visibilityThreshold = 0.6,
  crossfadeMs = 140,
  footer = null,
  autoAdvance = true,
  wrapAround = true,
  autoAdvanceSkipFooter = true,
}: ReelSnapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [crossfade, setCrossfade] = useState(false);

  const lastUserScrollTsRef = useRef(0);
  const nextPreloadBumpedForIdxRef = useRef(-1);

  const toIndex = useCallback((idx: number) => {
    const sec = sectionRefs.current[idx];
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Track manual scroll (cooldown for auto-advance)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      lastUserScrollTsRef.current = Date.now();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver orchestrates play/pause & active section
  useEffect(() => {
    const root = containerRef.current ?? null;
    const io = new IntersectionObserver(
      (entries) => {
        let bestIdx = -1;
        let bestRatio = 0;

        for (const e of entries) {
          const ds = e.target.getAttribute("data-index");
          const i = ds ? Number(ds) : -1;
          if (i >= 0 && e.intersectionRatio > bestRatio) {
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
              el.muted = true;
              el.playsInline = true;
              void el.play()?.catch(() => {});
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

  // Keyboard navigation (strictly typed; no any casts)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentIndex = () => {
      const top = el.scrollTop;
      let best = 0;
      let bestDist = Infinity;
      sectionRefs.current.forEach((sec, i) => {
        const dist = Math.abs((sec?.offsetTop ?? 0) - top);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    const onKey: (this: HTMLDivElement, e: KeyboardEvent) => void = function (e) {
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

  // Nudge first video shortly after mount
  useEffect(() => {
    const v0 = videoRefs.current[0];
    if (v0) setTimeout(() => { void v0.play()?.catch(() => {}); }, 60);
  }, []);

  // Resume current video when tab is visible again
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const v = videoRefs.current[activeIndex];
        if (v) { void v.play()?.catch(() => {}); }
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [activeIndex]);

  // One-time kickstart fallback for first video
  useEffect(() => {
    const kickstart = () => {
      const v0 = videoRefs.current[0];
      if (v0 && v0.paused) {
        v0.muted = true;
        v0.playsInline = true;
        void v0.play()?.catch(() => {});
      }
      window.removeEventListener("touchstart", kickstart);
      window.removeEventListener("mousedown", kickstart);
      window.removeEventListener("keydown", kickstart);
      window.removeEventListener("wheel", kickstart);
    };
    if (activeIndex === 0) {
      window.addEventListener("touchstart", kickstart, { once: true, passive: true });
      window.addEventListener("mousedown", kickstart, { once: true });
      window.addEventListener("keydown", kickstart, { once: true });
      window.addEventListener("wheel", kickstart, { once: true, passive: true });
      return () => {
        window.removeEventListener("touchstart", kickstart);
        window.removeEventListener("mousedown", kickstart);
        window.removeEventListener("keydown", kickstart);
        window.removeEventListener("wheel", kickstart);
      };
    }
  }, [activeIndex]);

  const panels = useMemo<Work[]>(() => items || [], [items]);
  const lastIndex = panels.length - 1;

  // Auto-advance helpers
  const advanceFrom = useCallback(
    (i: number) => {
      if (!autoAdvance) return;
      const sinceScroll = Date.now() - lastUserScrollTsRef.current;
      if (sinceScroll < 800) return;

      const isLast = i >= lastIndex;
      if (isLast) {
        if (wrapAround) {
          toIndex(0);
        } else if (!autoAdvanceSkipFooter && footer) {
          toIndex(panels.length); // footer section
        }
      } else {
        toIndex(i + 1);
      }
    },
    [autoAdvance, autoAdvanceSkipFooter, wrapAround, footer, lastIndex, panels.length, toIndex]
  );

  const maybePreloadNext = useCallback(
    (i: number, v: HTMLVideoElement) => {
      if (!autoAdvance || !v || !Number.isFinite(v.duration) || v.duration <= 0) return;
      const remaining = v.duration - v.currentTime;
      const nextIdx = i >= lastIndex ? (wrapAround ? 0 : null) : i + 1;
      if (nextIdx === null) return;
      if (remaining <= 2.0 && nextPreloadBumpedForIdxRef.current !== nextIdx) {
        const nextEl = videoRefs.current[nextIdx];
        if (nextEl) {
          try {
            nextEl.setAttribute("preload", "auto");
          } catch {
            /* noop: attribute may be unsupported */
          }
        }
        nextPreloadBumpedForIdxRef.current = nextIdx;
      }
    },
    [autoAdvance, lastIndex, wrapAround]
  );

  // Wire up native video events for every panel
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    panels.forEach((_, i) => {
      const el = videoRefs.current[i];
      if (!el) return;

      const onEnded = () => advanceFrom(i);
      const onTime = () => maybePreloadNext(i, el);

      el.addEventListener("ended", onEnded);
      el.addEventListener("timeupdate", onTime);

      cleanups.push(() => {
        el.removeEventListener("ended", onEnded);
        el.removeEventListener("timeupdate", onTime);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [panels, advanceFrom, maybePreloadNext]);

  // typed ref helper
  const setVideoRef = useCallback(
    (index: number) => (el: HTMLVideoElement | null) => {
      videoRefs.current[index] = el;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="
        h-screen w-full overflow-y-auto
        snap-y snap-mandatory
        scroll-smooth outline-none
        bg-black no-scrollbar no-bounce
        scroll-pb-[30vh] md:scroll-pb-0
      "
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* subtle crossfade veil when switching sections */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-150 ${
          crossfade ? "opacity-20" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* bottom-right index switcher */}
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
        const popUrl = (POP_WORK_URLS as Record<string, string | undefined>)[it.slug];

        return (
          <section
            key={it.slug}
            data-index={i}
            data-active={i === activeIndex}
            ref={(el) => {
              if (el) sectionRefs.current[i] = el;
            }}
            className="group relative reel-section w-full snap-start snap-always overflow-hidden"
          >
            <Video
              ref={setVideoRef(i)}
              poster={loop?.poster || it.heroVideo?.src}
              className="h-full w-full"
              sources={buildSources(loop)}
              // allow video to end so auto-advance can trigger
              loop={autoAdvance ? false : true}
              // only the first reel truly autoplays from paint
              autoPlay={i === 0}
              muted
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
            />

            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
              {showTitle && (
                <div className="title-pad md:pb-16 px-6 text-white">
                  <h2 className="pointer-events-auto text-4xl md:text-6xl font-semibold drop-shadow uppercase">
                    {popUrl ? (
                      <a
                        href={popUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-90 focus:opacity-90 focus:outline-none"
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
            </div>

            {/* subtle bottom fade over video */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </section>
        );
      })}

      {/* Footer snap target */}
      {footer ? (
        <section className="relative w-full snap-end snap-always bg-black safe-b-plus min-h-[30vh] md:min-h-0">
          {footer}
        </section>
      ) : null}
    </div>
  );
}
