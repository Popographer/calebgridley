// /components/SiteFooter.tsx
"use client";

import React from "react";

/**
 * Footer (contentinfo) with safe-area padding, semantic nav, and hardened external links.
 */
export default function SiteFooter() {
  const year = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      role="contentinfo"
      className="relative z-40 border-t border-neutral-800 bg-black px-6 pt-8 md:pt-10 safe-b-plus md:pb-10 text-sm text-neutral-300"
    >
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div aria-label="Copyright">© {year} Caleb Gridley. All rights reserved.</div>

        <nav aria-label="Footer">
          <ul className="flex items-center gap-6">
            <li>
              <a
                href="https://popographer.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Popographer (opens in a new tab)"
                className="hover:opacity-80 focus:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm transition"
              >
                Popographer
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/thepopographer/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram (opens in a new tab)"
                className="hover:opacity-80 focus:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm transition"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://popographer.com/licensing/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Licensing information on Popographer (opens in a new tab)"
                className="hover:opacity-80 focus:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm transition"
              >
                Licensing
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
