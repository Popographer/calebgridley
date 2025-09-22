// /components/SiteFooter.tsx
"use client";

import React from "react";

/**
 * Minimal, centered footer with ISNI links.
 * Small, neutral styling so it doesn't draw attention.
 */
export default function SiteFooter() {
  const year = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      role="contentinfo"
      className="relative z-40 border-t border-neutral-800 bg-black px-6 py-8 md:py-10 safe-b-plus text-sm text-neutral-300"
    >
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <p>
          © {year}, Caleb Gridley,&nbsp;
          <a
            href="https://popographer.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-80 focus:opacity-90 focus:outline-none"
            aria-label="Popographer (opens in a new tab)"
          >
            Popographer
          </a>
          , All rights reserved.
        </p>

        <p>
          Popographer<span aria-hidden="true">®</span>
          <span className="sr-only"> registered</span> is the trade name of Popographer LLC (Louisiana, USA).
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            ISNI (Caleb Gridley):{" "}
            <a
              href="https://isni.oclc.org/cbs/DB=1.2/CMD?ACT=SRCH&IKT=8006&TRM=ISN%3A0000000528217647&TERMS_OF_USE_AGREED=Y&terms_of_use_agree=send"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 focus:opacity-90 focus:outline-none"
            >
              0000 0005 2821 7647
            </a>
          </li>
          <li>
            ISNI (Popographer LLC):{" "}
            <a
              href="https://isni.oclc.org/cbs/DB=1.2/CMD?ACT=SRCH&IKT=8006&TRM=ISN%3A0000000528230294&TERMS_OF_USE_AGREED=Y&terms_of_use_agree=send"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-80 focus:opacity-90 focus:outline-none"
            >
              0000 0005 2823 0294
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
