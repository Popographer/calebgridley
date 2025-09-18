"use client";
import React from "react";

export interface SoundContextType {
  muted: boolean;
  toggle: () => void;
  // (optional future-proof, not required by callers)
  // setMuted?: (next: boolean) => void;
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
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw === "0" || raw === "false") return false;
      if (raw === "1" || raw === "true") return true;
    } catch {}
    return defaultMuted;
  });

  // Persist + expose state for CSS hooks
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {}
    // handy for CSS, tests, or quick inspection
    try {
      document.documentElement.setAttribute("data-sound-muted", muted ? "1" : "0");
    } catch {}
  }, [muted]);

  const toggle = React.useCallback(() => setMuted((m) => !m), []);

  // Global “M” to toggle (ignores when focused in a form field)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "m" || e.key === "M") && !isFormField(document.activeElement)) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return React.useMemo(() => ({ muted, toggle /*, setMuted*/ }), [muted, toggle]);
}

/**
 * Hook to keep a <video> element’s muted state in sync with the SoundContext.
 * Usage:
 *   const ref = React.useRef<HTMLVideoElement>(null);
 *   useSyncVideoMuted(ref);
 *   <video ref={ref} ... />
 */
export function useSyncVideoMuted(ref: React.RefObject<HTMLVideoElement | null>) {
  const { muted } = React.useContext(SoundContext);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // mark for debugging / optional selectors
    el.setAttribute("data-sync-sound", "1");
    // keep the element in sync
    el.muted = !!muted;
  }, [ref, muted]);

  // If the element instance changes, push current state immediately
  React.useEffect(() => {
    const el = ref.current;
    if (el) el.muted = !!muted;
  }, [ref]);
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
