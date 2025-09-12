"use client";
import React from "react";

export const SoundContext = React.createContext({ muted: true, toggle: () => {} });

export function useSoundController() {
  const [muted, setMuted] = React.useState(true);
  const toggle = () => setMuted((m) => !m);
  return React.useMemo(() => ({ muted, toggle }), [muted]);
}

export function SoundButton() {
  const { muted, toggle } = React.useContext(SoundContext);
  return (
    <button
      onClick={toggle}
      className="rounded-full bg-white/10 px-3 py-1.5 text-white backdrop-blur hover:bg-white/20 transition border border-white/20"
      aria-pressed={!muted}
      aria-label={muted ? "Enable sound" : "Mute sound"}
    >
      {muted ? "Sound Off" : "Sound On"}
    </button>
  );
}
