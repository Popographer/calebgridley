"use client";

const FOOTER_H = 72; // px – used by pages for bottom padding when needed

export default function FixedFooter() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[38]" aria-hidden="false">
      {/* gentle fade above footer to separate from video/content */}
      <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-t from-black/85 to-transparent" />

      <footer
        role="contentinfo"
        className="pointer-events-auto border-t border-neutral-800 bg-black/85 backdrop-blur
                   px-6 py-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-sm text-neutral-300"
        style={{ minHeight: FOOTER_H }}
      >
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>© {new Date().getFullYear()} Caleb Gridley. All rights reserved.</div>

          <nav aria-label="Footer links" className="flex items-center gap-6">
            <a className="hover:opacity-80" href="https://popographer.com/" target="_blank" rel="noopener noreferrer">
              Popographer
            </a>
            <a className="hover:opacity-80" href="https://www.instagram.com/thepopographer/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a className="hover:opacity-80" href="https://popographer.com/licensing/" target="_blank" rel="noopener noreferrer">
              Licensing
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

// Re-export a constant you can use elsewhere for spacing
export const FIXED_FOOTER_PX = 72;
