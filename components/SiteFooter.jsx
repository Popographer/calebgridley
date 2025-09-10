// components/SiteFooter.jsx
"use client";

export default function SiteFooter() {
  return (
    <footer className="relative z-40 border-t border-neutral-800 bg-black px-6 py-10 safe-b text-sm text-neutral-300">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>© {new Date().getFullYear()} Caleb Gridley. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a
            className="hover:opacity-80"
            href="https://popographer.com/"
            target="_blank"
            rel="noreferrer"
          >
            Popographer
          </a>
          <a
            className="hover:opacity-80"
            href="https://www.instagram.com/thepopographer/"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            className="hover:opacity-80"
            href="https://popographer.com/licensing/"
            target="_blank"
            rel="noreferrer"
          >
            Licensing
          </a>
        </div>
      </div>
    </footer>
  );
}
