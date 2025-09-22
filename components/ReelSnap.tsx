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

  // ---------- DEFAULT FOOTER (used when no footer prop is given) ----------
  const year = new Date().getFullYear();

  const ISNI_CAL = "https://isni.oclc.org/cbs/DB=1.2/CMD?ACT=SRCH&IKT=8006&TRM=ISN%3A0000000528217647&TERMS_OF_USE_AGREED=Y&terms_of_use_agree=send";
  const ISNI_POP = "https://isni.oclc.org/cbs/DB=1.2/CMD?ACT=SRCH&IKT=8006&TRM=ISN%3A0000000528230294&TERMS_OF_USE_AGREED=Y&terms_of_use_agree=send";

  const footerLinks: ReadonlyArray<{ label: string; href: string }> = [
    { label: "Shop", href: "/shop/" },
    { label: "Contact", href: "/contact/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Returns", href: "/returns/" },
    { label: "Terms", href: "/terms/" },
    { label: "Licensing", href: "/licensing/" },
    { label: "License", href: "/license/" },
    { label: "Press", href: "/press/" },
    { label: "Imprint", href: "/imprint/" },
  ];

  const defaultFooter = (
    <footer className="border-t border-white/10 bg-black text-neutral-200">
      <div className="mx-auto max-w-6xl px-6">
        {/* Link row */}
        <nav aria-label="Footer" className="py-6">
          <ul className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[15px]">
            {footerLinks.map((l) => (
              <li key={l.label}>
                <a className="hover:text-white focus:text-white focus:outline-none" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Search input */}
          <form action="/search/" method="get" className="mt-4">
            <label htmlFor="footer-search" className="sr-only">
              Search
            </label>
            <div className="relative max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                {/* magnifier icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                </svg>
              </div>
              <input
                id="footer-search"
                name="q"
                type="search"
                placeholder="Search"
                className="w-full rounded-md border border-white/15 bg-transparent py-2.5 pl-10 pr-3 text-white placeholder:text-neutral-400 outline-none focus:border-white/40"
                autoComplete="off"
              />
            </div>
          </form>
        </nav>

        {/* Legal block */}
        <div className="py-10 text-center text-sm leading-7">
          <p>
            © {year}, Caleb Gridley,{" "}
            <a
              href="https://popographer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/40 underline-offset-2 hover:text-white"
            >
              Popographer
            </a>
            . All rights reserved.
          </p>
          <p>Popographer® is the trade name of Popographer LLC (Louisiana, USA).</p>

          <ul className="mx-auto mt-4 list-inside list-disc space-y-1 text-left w-fit">
            <li>
              ISNI (Caleb Gridley):{" "}
              <a
                href={ISNI_CAL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-2 hover:text-white"
              >
                0000 0005 2821 7647
              </a>
            </li>
            <li>
              ISNI (Popographer LLC):{" "}
              <a
                href={ISNI_POP}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/40 underline-offset-2 hover:text-white"
              >
                0000 0005 2823 0294
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
  // --------------------------------------------------------------------

  // ---------- Accessible carousel semantics ----------
  const carouselLabel = "Featured works carousel";
  const liveRegionText = useMemo(() => {
    const total = panels.length || 1;
    const current = Math.min(Math.max(activeIndex + 1, 1), total);
    const currentTitle = panels[activeIndex]?.title || "Slide";
    return `Slide ${current} of ${total}: ${currentTitle}`;
  }, [activeIndex, panels]);
  // ---------------------------------------------------

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
      role="region"
      aria-roledescription="carousel"
      aria-label={carouselLabel}
    >
      {/* SR-only live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionText}
      </div>

      {/* crossfade veil */}
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity duration-150 ${
          crossfade ? "opacity-20" : "opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* index switcher */}
      <div className="group fixed bottom-6 right-6 z-40 select-none flex flex-col items-end gap-1" aria-label="Slide selector">
        <button
          className="pointer-events-auto text-white/90 font-mono text-base tracking-[0.15em] transition-opacity group-hover:opacity-0"
          aria-label={`Current section ${activeIndex + 1}`}
          onClick={() => toIndex(activeIndex)}
        >
          {num(activeIndex)}
        </button>
        <div className="pointer-events-auto hidden group-hover:flex flex-col items-end gap-1" role="list" aria-label="Go to slide">
          {panels.map((_, i) => (
            <button
              key={i}
              onClick={() => toIndex(i)}
              className={`font-mono text-base tracking-[0.15em] transition ${
                i === activeIndex ? "text-white font-semibold" : "text-white/60 hover:text-white/90"
              }`}
              aria-label={`Go to section ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
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
            role="group"
            aria-roledescription="slide"
            aria-label={`${it.title}${panels.length ? ` (${i + 1} of ${panels.length})` : ""}`}
          >
            <Video
              ref={setVideoRef(i)}
              poster={loop?.poster || it.heroVideo?.src}
              className="h-full w-full"
              sources={buildSources(loop)}
              loop={autoAdvance ? false : true}
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

            {/* subtle bottom fade */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </section>
        );
      })}

      {/* Footer snap target */}
      <section className="relative w-full snap-end snap-always bg-black safe-b-plus min-h-[30vh] md:min-h-0">
        {footer ?? defaultFooter}
      </section>
    </div>
  );
}
