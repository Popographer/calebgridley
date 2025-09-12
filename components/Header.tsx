"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body scroll lock without layout shift (desktop scrollbar compensation)
  useEffect(() => {
    if (!open) return;

    const { body, documentElement } = document;
    const hasScrollbar = window.innerWidth > documentElement.clientWidth;
    const scrollbarWidth = hasScrollbar ? window.innerWidth - documentElement.clientWidth : 0;

    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    // Focus the close button after paint
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Escape-to-close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus trap (no type assertions)
  useEffect(() => {
    if (!open) return;

    const container = dialogRef.current;
    if (!container) return;

    const isVisible = (el: HTMLElement) => {
      const s = window.getComputedStyle(el);
      return s.visibility !== "hidden" && s.display !== "none";
    };

    const getFocusable = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
        )
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1 && isVisible(el));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusables = getFocusable();
      if (focusables.length === 0) return;

      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      const active =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;

      if (e.shiftKey) {
        // wrap to last if focus is outside or at the first
        if (!active || !container.contains(active) || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // wrap to first if at the last
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <header>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 mix-blend-difference">
        <Link
          href="/"
          className="text-white text-xl font-semibold tracking-tight"
          aria-label="Caleb Gridley | Home"
          prefetch
        >
          Caleb Gridley
        </Link>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="main-menu"
          aria-label="Open menu"
          className="text-white/90 hover:text-white transition"
        >
          <Menu aria-hidden="true" />
        </button>
      </div>

      {/* Fullscreen overlay menu */}
      {open && (
        <div
          id="main-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="main-menu-title"
          tabIndex={-1}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false); // backdrop click
          }}
          className={[
            "fixed inset-0 z-50 text-white",
            "bg-black/70 supports-[backdrop-filter]:backdrop-blur-sm",
            prefersReducedMotion ? "" : "animate-fadeIn",
          ].join(" ")}
        >
          <h2 id="main-menu-title" className="sr-only">
            Main menu
          </h2>

          {/* Top row with X */}
          <div className="flex items-center justify-between p-6">
            <button
              type="button"
              ref={closeBtnRef}
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="hover:opacity-80 focus:outline-none rounded"
            >
              <X aria-hidden="true" />
            </button>
            <div style={{ width: 24, height: 24 }} aria-hidden="true" />
          </div>

          {/* Nav links */}
          <nav className="min-h-[calc(100vh-80px)] flex items-center">
            <ul className="px-6 space-y-6 text-3xl">
              <li>
                <Link href="/" onClick={() => setOpen(false)} className="block hover:opacity-80" prefetch>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/work" onClick={() => setOpen(false)} className="block hover:opacity-80" prefetch>
                  Work
                </Link>
              </li>
              <li>
                <a
                  href="https://popographer.com/about/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block hover:opacity-80"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://popographer.com/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block hover:opacity-80"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
