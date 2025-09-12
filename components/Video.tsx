"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { SoundContext } from "./SoundContext";

/** Discrete <source> entry for the <video>. */
export type VideoSource = {
  src: string;
  type?: string;
  media?: string;
};

export type VideoProps = Omit<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  "src" | "poster" | "preload" | "loop" | "autoPlay" | "controls"
> & {
  /** If you use multiple sources, pass them here. `src` prop still works for a single source. */
  sources?: VideoSource[];
  src?: string;
  poster?: string;
  className?: string;

  /** Default is `"metadata"`, pass `"auto"` for the first reel. */
  preload?: "none" | "metadata" | "auto";

  /** Default true; when false, the video can end (useful for auto-advance). */
  loop?: boolean;

  controls?: boolean;
  autoPlay?: boolean;

  /** Optional: controlsList (e.g. "nodownload noplaybackrate noremoteplayback"). */
  controlsList?: string;

  /**
   * Reduce AirPlay/remote prompts (sets disableRemotePlayback + x-webkit-airplay="deny").
   * Defaults to true.
   */
  preventRemotePlayback?: boolean;

  /** Small delay before the first autoplay attempt (ms). Defaults to 40. */
  eagerStartDelayMs?: number;

  /** Legacy back-compat: you can still receive the <video> element via this. */
  tagRef?: React.Ref<HTMLVideoElement>;
};

const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
  {
    sources = [],
    src,
    poster,
    className = "",
    loop = true,
    controls = false,
    autoPlay = true,
    preload = "metadata",
    tagRef,

    // QoL
    controlsList,
    preventRemotePlayback = true,
    eagerStartDelayMs = 40,

    // We intercept these to run our internal logic, then call user handlers
    onLoadedMetadata,
    onLoadedData,
    onCanPlay,
    onPlay,
    onError,

    ...rest
  },
  forwardedRef
) {
  const { muted } = useContext(SoundContext);
  const [ready, setReady] = useState(false);
  const localRef = useRef<HTMLVideoElement | null>(null);

  const resumeHandlersRef = useRef<{ installed: boolean; fn: (() => void) | null }>({
    installed: false,
    fn: null,
  });

  // Expose the <video> element via both forwardedRef and legacy tagRef
  useImperativeHandle(forwardedRef, () => localRef.current);
  useEffect(() => {
    if (!tagRef) return;
    if (typeof tagRef === "function") tagRef(localRef.current);
    else if (typeof tagRef === "object") {
      (tagRef as React.MutableRefObject<HTMLVideoElement | null>).current = localRef.current;
    }
  }, [tagRef]);

  // Apply non-typed attributes/properties imperatively (TS-safe)
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    // Safari/iOS friendly defaults
    el.muted = true;
    try {
      el.defaultMuted = true; // property on the element, not a JSX prop
    } catch {
      /* noop */
    }
    el.playsInline = true;
    el.setAttribute("playsinline", "true");
    // typed webkitPlaysInline without `any`
    (el as HTMLVideoElement & { webkitPlaysInline?: boolean }).webkitPlaysInline = true;

    if (controlsList) {
      el.setAttribute("controlsList", controlsList);
    }

    if (preventRemotePlayback) {
      el.setAttribute("disableRemotePlayback", "");
      el.setAttribute("x-webkit-airplay", "deny");
    }
  }, [controlsList, preventRemotePlayback]);

  const installOneShotGestureResume = useCallback((el: HTMLVideoElement) => {
    if (resumeHandlersRef.current.installed) return;

    const resume = () => {
      setTimeout(() => {
        void el.play()?.catch(() => {});
      }, 10);
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
    document.addEventListener("wheel", resume, { once: true, passive: true });
    resumeHandlersRef.current.installed = true;
  }, []);

  const tryPlay = useCallback(() => {
    const el = localRef.current;
    if (!autoPlay || !el) return;

    el.muted = true;
    el.playsInline = true;

    const p = el.play?.();
    if (p !== undefined) {
      // no unused error param
      p.catch?.(() => installOneShotGestureResume(el));
    }
  }, [autoPlay, installOneShotGestureResume]);

  // First nudge
  useEffect(() => {
    const t = setTimeout(tryPlay, eagerStartDelayMs);
    return () => clearTimeout(t);
  }, [tryPlay, muted, eagerStartDelayMs]);

  // Some devices only succeed after metadata arrives
  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const onMeta = () => tryPlay();
    el.addEventListener("loadedmetadata", onMeta, { once: true });
    return () => el.removeEventListener("loadedmetadata", onMeta);
  }, [tryPlay]);

  // Visibility resume — capture ref snapshot for cleanup
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };

    const resumeHandlers = resumeHandlersRef.current;

    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);

      const r = resumeHandlers.fn;
      if (resumeHandlers.installed && r) {
        document.removeEventListener("pointerdown", r);
        document.removeEventListener("touchstart", r);
        document.removeEventListener("mousedown", r);
        document.removeEventListener("keydown", r);
        document.removeEventListener("wheel", r);
      }
    };
  }, [tryPlay]);

  const markReady = () => setReady(true);

  // Combine internal + user handlers
  const handleLoadedMetadata: React.VideoHTMLAttributes<HTMLVideoElement>["onLoadedMetadata"] =
    (e) => {
      e.currentTarget.muted = true;
      e.currentTarget.playsInline = true;
      onLoadedMetadata?.(e);
    };

  const handleLoadedData: React.VideoHTMLAttributes<HTMLVideoElement>["onLoadedData"] = (e) => {
    markReady();
    onLoadedData?.(e);
  };

  const handleCanPlay: React.VideoHTMLAttributes<HTMLVideoElement>["onCanPlay"] = (e) => {
    markReady();
    onCanPlay?.(e);
  };

  const handlePlay: React.VideoHTMLAttributes<HTMLVideoElement>["onPlay"] = (e) => {
    markReady();
    onPlay?.(e);
  };

  const handleError: React.VideoHTMLAttributes<HTMLVideoElement>["onError"] = (e) => {
    setReady(false);
    onError?.(e);
  };

  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        backgroundImage: poster ? `url(${poster})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <video
        ref={localRef}
        className="h-full w-full object-cover transition-opacity duration-150"
        style={{ opacity: ready ? 1 : 0.0001 }}
        poster={poster}
        // Parse-time basics
        muted
        playsInline
        autoPlay={autoPlay}
        loop={loop}
        preload={preload}
        crossOrigin="anonymous"
        disablePictureInPicture
        controls={controls}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onPlay={handlePlay}
        onError={handleError}
        {...rest}
      >
        {Array.isArray(sources) && sources.length > 0 ? (
          sources.map((s, i) => (
            <source key={`${s.src}-${i}`} src={s.src} type={s.type} {...(s.media ? { media: s.media } : {})} />
          ))
        ) : src ? (
          <source src={src} />
        ) : null}
      </video>
    </div>
  );
});

export default Video;
