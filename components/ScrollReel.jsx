"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Video, { VimeoEmbed, YouTubeEmbed } from "./Video";
import { SoundContext } from "./SoundContext";

/** Uppercase title with subtle letter-by-letter rise */
function AnimatedTitle({ text, active }) {
  const letters = (text || "").toUpperCase().split("");
  return (
    <h2
      aria-label={text}
      className="uppercase text-4xl md:text-6xl font-semibold tracking-[0.08em] drop-shadow"
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: "0.35em", opacity: 0 }}
          animate={active ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.3 }}
          transition={{ duration: 0.35, delay: active ? i * 0.035 : 0, ease: "easeOut" }}
        >
          {ch}
        </motion.span>
      ))}
    </h2>
  );
}

export default function ScrollReel({
  items,
  overlap = 0.18,          // tighter overlap for snappier fades
  sectionVH = 100,
  snap = true
}) {
  const wrapRef = useRef(null);
  const vidsRef = useRef([]);
  const { muted } = React.useContext(SoundContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end start"] });
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 20, mass: 0.25 });

  const opacities = items.map((_, i) => {
    const n = items.length;
    const center = i / (n - 1 || 1);
    const start = Math.max(0, center - overlap);
    const end = Math.min(1, center + overlap);
    return useTransform(eased, [start, center, end], [0, 1, 0]);
  });

  // Cross-fade controller + play/pause + active index
  useEffect(() => {
    const unsub = opacities.map((o, i) =>
      o.on("change", (v) => {
        const el = vidsRef.current[i];
        if (v > 0.92) {
          // set active
          if (activeIndex !== i) setActiveIndex(i);
          // pause others, play this
          vidsRef.current.forEach((vid, idx) => {
            if (idx !== i && vid && !vid.paused) vid.pause();
          });
          if (el) {
            el.muted = muted;
            el.play().catch(() => {});
          }
        }
      })
    );
    return () => unsub.forEach((u) => u && u());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opacities, muted]);

  // Snap logic (desktop wheel remains natural on touch)
  useEffect(() => {
    if (!snap) return;
    let t;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const node = wrapRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const p = Math.min(
          1,
          Math.max(
            0,
            (window.scrollY + window.innerHeight / 2 - sectionTop) /
              (rect.height - window.innerHeight)
          )
        );
        const targetIndex = Math.round(p * (items.length - 1));
        toIndex(targetIndex);
      }, 120);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, snap]);

  // Programmatic jump
  const toIndex = (idx) => {
    const node = wrapRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const per = idx / (items.length - 1 || 1);
    const targetY = sectionTop + per * (rect.height - window.innerHeight);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // Pretty number like "01"
  const num = (i) => String(i + 1).padStart(2, "0");

  return (
    <>
      {/* bottom-right numeric index (collapses when not hovered) */}
      <div className="group fixed bottom-6 right-6 z-40 select-none">
        {/* Collapsed: current */}
        <button
          className="pointer-events-auto text-white/90 font-mono text-sm tracking-[0.2em] bg-black/35 rounded px-3 py-1 backdrop-blur
                     transition-opacity group-hover:opacity-0"
          aria-label={`Current section ${activeIndex + 1}`}
        >
          {num(activeIndex)}
        </button>
        {/* Expanded list on hover */}
        <div className="pointer-events-auto hidden group-hover:flex items-center gap-3 bg-black/45 rounded-full px-3 py-1 backdrop-blur">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => toIndex(i)}
              className={`font-mono text-sm tracking-[0.2em] transition ${
                i === activeIndex ? "text-white font-semibold" : "text-white/60 hover:text-white/90"
              }`}
              aria-label={`Go to section ${i + 1}`}
            >
              {num(i)}
            </button>
          ))}
        </div>
      </div>

      <section ref={wrapRef} className="relative" style={{ height: `${items.length * sectionVH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0">
            {items.map((it, i) => {
              const kind = it?.heroVideo?.kind;
              const showTitle = !(i === 0 && it?.slug === "caleb-gridley");

              return (
                <motion.div
                  key={it.slug}
                  className="absolute inset-0 will-change-[opacity,transform] pointer-events-none"
                  style={{ opacity: opacities[i] }}
                  transition={{ opacity: { duration: 0.22, ease: "easeOut" } }} // quick cross-fade
                >
                  {/* media */}
                  <div className="pointer-events-none absolute inset-0">
                    {kind === "vimeo" ? (
                      <VimeoEmbed id={it.heroVideo.id} className="h-full w-full" />
                    ) : kind === "youtube" ? (
                      <YouTubeEmbed id={it.heroVideo.id} className="h-full w-full" />
                    ) : kind === "image" ? (
                      <img src={it.heroVideo.src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Video
                        tagRef={(el) => (vidsRef.current[i] = el)}
                        src={it?.heroVideo?.src}
                        className="h-full w-full object-cover"
                        loop
                      />
                    )}
                  </div>

                  {/* gradient for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />

                  {/* title + meta */}
                  {showTitle && (
                    <div className="absolute bottom-16 left-6 right-6 text-white pointer-events-none">
                      <div className="max-w-3xl">
                        <AnimatedTitle text={it.title} active={activeIndex === i} />
                        {it.year || it.role ? (
                          <p className="mt-2 text-neutral-200">
                            {it.role ? <span className="uppercase">{it.role}</span> : null}
                            {it.role && it.year ? " • " : ""}
                            {it.year || null}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
