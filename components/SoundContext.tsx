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

export function useSoundController(defaultMuted = true): SoundContextType {
  const [muted, setMuted] = React.useState<boolean>(defaultMuted);
  const toggle = React.useCallback(() => setMuted((m) => !m), []);
  return React.useMemo(() => ({ muted, toggle }), [muted, toggle]);
}

export function SoundProvider({
  children,
  defaultMuted = true,
}: {
  children: React.ReactNode;
  defaultMuted?: boolean;
}) {
  const controller = useSoundController(defaultMuted);
  return (
    <SoundContext.Provider value={controller}>
      {children}
    </SoundContext.Provider>
  );
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
    >
      {muted ? "Sound Off" : "Sound On"}
    </button>
  );
}
