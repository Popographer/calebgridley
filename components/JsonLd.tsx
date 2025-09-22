// components/JsonLd.tsx
import React from "react";

type JsonLdProps = {
  /** Unique DOM id for this JSON-LD block */
  id: string;
  /** Parsed JSON-LD data (objects/arrays/primitives) */
  data: unknown;
  /** Optional Content-Security-Policy nonce */
  nonce?: string;
  /** Optional marker to identify first-party scripts (defaults to 'cg-o') */
  dataOwned?: string;
  /** Optional route guard attribute (e.g., '/identity/', '/work/') */
  dataPath?: string;
};

/**
 * Deterministic stringify:
 * - Sorts object keys for stable output
 * - Preserves array order
 * - Skips undefined & function values
 * - Supports Date/URL/custom toJSON() objects
 * - Handles simple circular refs gracefully (replaces with "[Circular]")
 */
function stableStringify(value: unknown): string {
  const seen = new WeakSet<object>();

  const normalize = (v: unknown): any => {
    if (v === null || typeof v !== "object") return v;

    // Allow objects that define a custom toJSON() to control their representation
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyV: any = v;
      if (typeof anyV.toJSON === "function") return normalize(anyV.toJSON());
    } catch {}

    if (v instanceof Date) return v.toISOString();

    // Guard for server envs where URL may not exist
    // (no ts-expect-error needed since we check existence)
    if (typeof URL !== "undefined" && v instanceof URL) return v.toString();

    if (Array.isArray(v)) return v.map((item) => normalize(item));

    if (seen.has(v as object)) return "[Circular]";
    seen.add(v as object);

    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj).sort()) {
      const val = obj[key];
      if (typeof val === "undefined" || typeof val === "function") continue;
      out[key] = normalize(val);
    }
    return out;
  };

  return JSON.stringify(normalize(value));
}

/** Escape sequences that could prematurely break out of the script tag */
function safeJsonForHtml(json: string): string {
  return json
    .replace(/<\//g, "<\\/")      // </script> safe
    .replace(/</g, "\\u003C")     // any remaining <
    .replace(/-->/g, "--\\>")     // HTML comment edge
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({
  id,
  data,
  nonce,
  dataOwned = "cg-o",
  dataPath,
}: JsonLdProps) {
  const json = React.useMemo(() => safeJsonForHtml(stableStringify(data)), [data]);

  // Precisely type data-* attrs so we can spread without ts-ignore
  const extraAttrs: (Partial<Record<`data-${string}`, string>> & { nonce?: string }) = {};
  if (nonce) extraAttrs.nonce = nonce;
  if (dataOwned) extraAttrs["data-owned"] = dataOwned;
  if (dataPath) extraAttrs["data-path"] = dataPath;

  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      {...extraAttrs}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
