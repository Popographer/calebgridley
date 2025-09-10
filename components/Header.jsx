// components/Header.jsx
"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 mix-blend-difference">
        <Link
          href="/"
          className="text-white text-xl font-semibold tracking-tight"
          aria-label="Caleb Gridley — Home"
        >
          Caleb Gridley
        </Link>

        {/* Hamburger (kept) */}
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-white/90 hover:text-white transition"
        >
          <Menu />
        </button>
      </div>

      {/* Fullscreen overlay menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white">
          {/* Top row with X on the LEFT; no 'Menu' label */}
          <div className="flex items-center justify-between p-6">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="hover:opacity-80"
            >
              <X />
            </button>
            {/* spacer to keep visual balance */}
            <div style={{ width: 24, height: 24 }} aria-hidden="true" />
          </div>

          {/* Centered vertically; left-aligned links */}
          <nav className="min-h-[calc(100vh-80px)] flex items-center">
            <div className="px-6 space-y-6 text-3xl">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block hover:opacity-80"
              >
                Home
              </Link>
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="block hover:opacity-80"
              >
                Work
              </Link>
              <a
                href="https://popographer.com/about/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="block hover:opacity-80"
              >
                About
              </a>
              <a
                href="https://popographer.com/contact/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="block hover:opacity-80"
              >
                Contact
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
