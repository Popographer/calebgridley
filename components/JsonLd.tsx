// components/JsonLd.tsx
import React from "react";

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue | undefined };
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

type JsonLdProps = {
  /** Unique DOM id for this JSON-LD block (optional) */
  id?: string;
  /** Parsed JSON-LD data (objects/arrays/primitives) */
  data: JsonValue;
  /** Optional Content-Security-Policy nonce */
  nonce?: string;
  /** Optional marker to identify first-party scripts (e.g., 'cg-o') */
  dataOwned?: string;
  /** Optional route guard attribute (e.g., '/identity/', '/work/') */
  dataPath?: string;
};

/**
 * Deterministic stringify:
 * - Sorts object keys for stable output
 * - Preserves array order
 * - Skips undefined values
 * - Detects simple circular refs
 */
function stableStringify(value: JsonValue): string {
  const seen = new WeakSet<object>();

  const normalize = (v: JsonValue): JsonValue => {
    if (v === null) return v;
    if (typeof v !== "object") return v;

    if (Array.isArray(v)) {
      return v.map((item) => normalize(item)) as JsonValue[];
    }

    const obj = v as JsonObject;
    if (seen.has(obj as object)) return "[Circular]";
    seen.add(obj as object);

    const out: JsonObject = {};
    for (const key of Object.keys(obj).sort()) {
      const val = obj[key];
      if (typeof val === "undefined") continue;
      out[key] = normalize(val as JsonValue);
    }
    return out as JsonValue;
  };

  return JSON.stringify(normalize(value));
}

/** Escape sequences that could prematurely break out of the script tag */
function safeJsonForHtml(json: string): string {
  return json
    .replace(/<\//g, "<\\/")       // </script>
    .replace(/</g, "\\u003C")      // <
    .replace(/-->/g, "--\\>")      // HTML comment close
    .replace(/\u2028/g, "\\u2028") // line sep
    .replace(/\u2029/g, "\\u2029");// paragraph sep
}

export default function JsonLd({
  id = "jsonld",
  data,
  nonce,
  dataOwned,
  dataPath,
}: JsonLdProps) {
  const json = React.useMemo(
    () => safeJsonForHtml(stableStringify(data)),
    [data]
  );

  // Build data-* attributes only if provided
  const dataAttrs: Record<string, string> = {};
  if (dataOwned) dataAttrs["data-owned"] = dataOwned;
  if (dataPath) dataAttrs["data-path"] = dataPath;

  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      nonce={nonce}
      {...dataAttrs}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
