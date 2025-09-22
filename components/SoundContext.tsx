"use client";
import React from "react";

export interface SoundContextType {
  muted: boolean;
  toggle: () => void;
}

export const SoundContext = React.createContext<SoundContextType>({
  muted: true,
  toggle: () => {},
});

const STORAGE_KEY = "cg:soundMuted";

/** Guard: don’t treat keypresses inside inputs/textareas as global shortcuts. */
function isFormField(el: Element | null): boolean {
  if (!el) return false;
  const tag = (el as HTMLElement).tagName?.toLowerCase();
  if (["input", "textarea", "select"].includes(tag)) return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useSoundController(defaultMuted = true): SoundContextType {
  // Initialize from storage synchronously if possible
  const [muted, setMuted] = React.useState<boolean>(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw === "0" || raw === "false") return false;
      if (raw === "1" || raw === "true") return true;
    } catch {
      /* ignore: storage not available */
    }
    return defaultMuted;
  });

  // Persist + expose state for CSS hooks
  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      /* ignore: storage not available */
    }
    try {
      document.documentElement.setAttribute(
        "data-sound-muted",
        muted ? "1" : "0"
      );
    } catch {
      /* ignore: SSR / no document */
    }
  }, [muted]);

  const toggle = React.useCallback(() => setMuted((m) => !m), []);

  // Global “M” to toggle (ignores when focused in a form field)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.key === "m" || e.key === "M") &&
        !isFormField(document.activeElement)
      ) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return React.useMemo(() => ({ muted, toggle }), [muted, toggle]);
}

/**
 * Hook to keep a <video> element’s muted state in sync with the SoundContext.
 */
export function useSyncVideoMuted(
  ref: React.RefObject<HTMLVideoElement | null>
) {
  const { muted } = React.useContext(SoundContext);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-sync-sound", "1");
    el.muted = muted;
  }, [ref, muted]);

  React.useEffect(() => {
    const el = ref.current;
    if (el) el.muted = muted;
  }, [ref, muted]);
}

export function SoundProvider({
  children,
  defaultMuted = true,
}: {
  children: React.ReactNode;
  defaultMuted?: boolean;
}) {
  const controller = useSoundController(defaultMuted);
  return <SoundContext.Provider value={controller}>{children}</SoundContext.Provider>;
}

export function SoundButton() {
  const { muted, toggle } = React.useContext(SoundContext);
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full bg-white/10 px-3 py-1.5 text-white backdrop-blur hover:bg-white/20 transition border border-white/20"
      aria-pressed={!muted}
      aria-label={muted ? "Enable sound" : "Mute sound"}
      title={muted ? "Enable sound (M)" : "Mute sound (M)"}
    >
      {muted ? "Sound Off" : "Sound On"}
    </button>
  );
}
