// components/JsonLd.tsx
import React from "react";

/** Strict JSON value types */
type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [k: string]: JsonValue };
type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

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

function isUrlLike(v: unknown): v is URL {
  return typeof URL !== "undefined" && v instanceof URL;
}

/**
 * Deterministic stringify:
 * - Sorts object keys for stable output
 * - Preserves array order
 * - Skips undefined & function values
 * - Converts Date/URL/custom toJSON() to strings/JSON
 * - Handles simple circular refs ("[Circular]")
 */
function stableStringify(value: unknown): string {
  const seen = new WeakSet<object>();

  const toJsonValue = (v: unknown): JsonValue => {
    if (v === null) return null;

    const t = typeof v;
    if (t === "string" || t === "number" || t === "boolean") return v;

    // Respect custom toJSON if present
    if (typeof v === "object" && v !== null && "toJSON" in (v as object)) {
      const fn = (v as { toJSON?: () => unknown }).toJSON;
      if (typeof fn === "function") {
        try {
          return toJsonValue(fn());
        } catch {
          /* fall through and treat as plain object */
        }
      }
    }

    // Special cases
    if (v instanceof Date) return v.toISOString();
    if (isUrlLike(v)) return v.toString();

    // Arrays
    if (Array.isArray(v)) {
      const out: JsonArray = v.map((item) => toJsonValue(item));
      return out;
    }

    // Objects
    if (typeof v === "object" && v !== null) {
      if (seen.has(v as object)) return "[Circular]";
      seen.add(v as object);

      const src = v as Record<string, unknown>;
      const out: JsonObject = {};
      for (const key of Object.keys(src).sort()) {
        const val = src[key];
        if (typeof val === "undefined" || typeof val === "function") continue;
        out[key] = toJsonValue(val);
      }
      return out;
    }

    // Fallback for exotic values
    return String(v);
  };

  return JSON.stringify(toJsonValue(value));
}

/** Escape sequences that could prematurely break out of the script tag */
function safeJsonForHtml(json: string): string {
  return json
    .replace(/<\//g, "<\\/") // </script> safe
    .replace(/</g, "\\u003C")
    .replace(/-->/g, "--\\>")
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
  const json = React.useMemo(
    () => safeJsonForHtml(stableStringify(data)),
    [data]
  );

  // Precisely type data-* attrs so we can spread without ts-ignore
  const extraAttrs: (Partial<Record<`data-${string}`, string>> & {
    nonce?: string;
  }) = {};
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
