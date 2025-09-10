// components/Video.jsx
"use client";
import React from "react";
import { SoundContext } from "./SoundContext";

/**
 * <Video>
 *  - Prefer `sources` (ordered best→fallback):
 *      [{ src, type, media? }, ...]
 *  - You can also pass a single `src` (string) if easier.
 *  - `autoPlay` defaults to true and we also programmatically
 *    call play() on mount/ready to dodge occasional browser stalls.
 */
export default function Video({
  sources = [],
  src,                         // optional single source
  poster,
  className = "",
  loop = true,
  controls = false,
  autoPlay = true,
  tagRef,
}) {
  const { muted } = React.useContext(SoundContext);
  const [ready, setReady] = React.useState(false);
  const localRef = React.useRef(null);

  // Merge external ref (function or ref object) with our local ref
  const setRef = (el) => {
    localRef.current = el;
    if (typeof tagRef === "function") tagRef(el);
    else if (tagRef && typeof tagRef === "object") tagRef.current = el;
  };

  // Try to kick playback when the element is present / muted state changes
  React.useEffect(() => {
    if (!autoPlay) return;
    const el = localRef.current;
    if (!el) return;
    // tiny delay helps some browsers after source selection
    const t = setTimeout(() => el.play().catch(() => {}), 40);
    return () => clearTimeout(t);
  }, [autoPlay, muted]);

  const markReady = () => setReady(true);

  return (
    <div
      className={`relative ${className}`}
      style={{
        backgroundImage: poster ? `url(${poster})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <video
        ref={setRef}
        className="h-full w-full object-cover transition-opacity duration-150"
        style={{ opacity: ready ? 1 : 0.0001 }}
        poster={poster}
        muted={muted}           // critical for mobile autoplay
        playsInline             // iOS: stay inline
        autoPlay={autoPlay}
        loop={loop}
        preload="auto"          // eager enough to avoid first-frame black
        crossOrigin="anonymous"
        disablePictureInPicture
        controls={controls}
        // any of these will flip the opacity to 1
        onLoadedData={markReady}
        onCanPlay={markReady}
        onPlay={markReady}
        onError={() => setReady(false)}
      >
        {Array.isArray(sources) && sources.length > 0 ? (
          sources.map((s, i) => (
            <source key={i} src={s.src} type={s.type} {...(s.media ? { media: s.media } : {})} />
          ))
        ) : src ? (
          <source src={src} />
        ) : null}
      </video>
    </div>
  );
}

export function VimeoEmbed({ id, className = "" }) {
  const url = `https://player.vimeo.com/video/${id}?background=1&autoplay=1&muted=1&loop=1&byline=0&title=0&controls=0&dnt=1&playsinline=1`;
  return (
    <iframe
      src={url}
      className={className}
      allow="autoplay; fullscreen; picture-in-picture"
      loading="eager"
      referrerPolicy="no-referrer"
      title={`Vimeo ${id}`}
    />
  );
}

export function YouTubeEmbed({ id, className = "" }) {
  const url = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${id}`;
  return (
    <iframe
      src={url}
      className={className}
      allow="autoplay; fullscreen; picture-in-picture"
      loading="eager"
      referrerPolicy="no-referrer"
      title={`YouTube ${id}`}
    />
  );
}
