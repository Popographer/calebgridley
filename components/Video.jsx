// components/Video.jsx
"use client";
import React from "react";
import { SoundContext } from "./SoundContext";

export default function Video({
  sources = [],
  src,
  poster,
  className = "",
  loop = true,
  controls = false,
  autoPlay = true,
  preload = "metadata", // pass "auto" for the first reel
  tagRef,
}) {
  const { muted } = React.useContext(SoundContext);
  const [ready, setReady] = React.useState(false);
  const localRef = React.useRef(null);
  const resumeHandlersRef = React.useRef({ installed: false, fn: null });

  const setRef = (el) => {
    localRef.current = el;
    if (typeof tagRef === "function") tagRef(el);
    else if (tagRef && typeof tagRef === "object") tagRef.current = el;
  };

  const tryPlay = React.useCallback(() => {
    const el = localRef.current;
    if (!autoPlay || !el) return;

    // Ensure these are set BEFORE any play() attempt
    el.muted = true;
    el.playsInline = true;

    const p = el.play?.();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        if (!resumeHandlersRef.current.installed) {
          const resume = () => {
            // Tiny delay helps certain iOS builds after the user gesture
            setTimeout(() => el.play().catch(() => {}), 10);

            document.removeEventListener("pointerdown", resume);
            document.removeEventListener("touchstart", resume);
            document.removeEventListener("mousedown", resume);
            document.removeEventListener("keydown", resume);
            document.removeEventListener("wheel", resume);

            resumeHandlersRef.current.installed = false;
            resumeHandlersRef.current.fn = null;
          };
          resumeHandlersRef.current.fn = resume;
          document.addEventListener("pointerdown", resume, { once: true });
          document.addEventListener("touchstart", resume, { once: true });
          document.addEventListener("mousedown", resume, { once: true });
          document.addEventListener("keydown", resume, { once: true });
          document.addEventListener("wheel", resume, { once: true });
          resumeHandlersRef.current.installed = true;
        }
      });
    }
  }, [autoPlay]);

  React.useEffect(() => {
    const t = setTimeout(tryPlay, 40);
    return () => clearTimeout(t);
  }, [tryPlay, muted]);

  React.useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      if (resumeHandlersRef.current.installed && resumeHandlersRef.current.fn) {
        const r = resumeHandlersRef.current.fn;
        document.removeEventListener("pointerdown", r);
        document.removeEventListener("touchstart", r);
        document.removeEventListener("mousedown", r);
        document.removeEventListener("keydown", r);
        document.removeEventListener("wheel", r);
      }
    };
  }, [tryPlay]);

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

        /* Critical autoplay attrs present at parse time (older iOS/Safari) */
        muted
        defaultMuted
        playsInline
        {...{ "webkit-playsinline": "true" }}

        autoPlay={autoPlay}
        loop={loop}
        preload={preload}
        crossOrigin="anonymous"
        disablePictureInPicture
        controls={controls}
        onLoadedMetadata={(e) => {
          // Belt & suspenders: keep these true even if the element rehydrates
          e.currentTarget.muted = true;
          e.currentTarget.playsInline = true;
        }}
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
