// components/JsonLd.tsx
import React from "react";

/** Strict JSON value types we generate after normalization */
type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue | undefined };
type JsonArray = ReadonlyArray<JsonValue>;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type JsonLdProps = {
  /** Unique DOM id for this JSON-LD block */
  id: string;
  /** Accept anything; we normalize safely to JsonValue */
  data: unknown;
  /** Optional Content-Security-Policy nonce */
  nonce?: string;
  /** Optional marker to identify first-party scripts (defaults to 'cg-o') */
  dataOwned?: string;
  /** Optional route guard attribute (e.g., '/identity/', '/work/') */
  dataPath?: string;
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/**
 * Normalize arbitrary input into our JsonValue domain, deterministically:
 * - Sorts object keys for stable output
 * - Preserves array order (supports readonly arrays)
 * - Skips undefined & function values
 * - Supports Date / URL / custom toJSON()
 * - Handles simple circular refs (replaced with "[Circular]")
 */
function normalizeToJsonValue(input: unknown, seen: WeakSet<object>): JsonValue {
  // Primitives
  if (input === null) return null;
  if (typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
    return input;
  }

  // Coerce non-JSON primitives to strings
  if (typeof input === "undefined" || typeof input === "symbol" || typeof input === "bigint" || typeof input === "function") {
    return String(input);
  }

  // Dates / URL -> string
  if (input instanceof Date) return input.toISOString();
  if (typeof URL !== "undefined" && input instanceof URL) return input.toString();

  // Arrays (readonly OK)
  if (Array.isArray(input)) {
    return (input as ReadonlyArray<unknown>).map((item) => normalizeToJsonValue(item, seen));
  }

  // Objects (including custom toJSON)
  if (isPlainObject(input)) {
    const maybeToJSON = (input as { toJSON?: unknown }).toJSON;
    if (typeof maybeToJSON === "function") {
      try {
        const j = (maybeToJSON as () => unknown).call(input);
        return normalizeToJsonValue(j, seen);
      } catch {
        /* fall through */
      }
    }

    if (seen.has(input as object)) return "[Circular]";
    seen.add(input as object);

    const out: JsonObject = {};
    const obj = input as Record<string, unknown>;
    for (const key of Object.keys(obj).sort()) {
      const val = obj[key];
      if (typeof val === "undefined" || typeof val === "function") continue;
      out[key] = normalizeToJsonValue(val, seen);
    }
    return out;
  }

  // Final fallback for exotic values
  return String(input);
}

/** Deterministic stringify into JSON text */
function stableStringify(value: unknown): string {
  const normalized = normalizeToJsonValue(value, new WeakSet());
  return JSON.stringify(normalized);
}

/** Escape sequences that could prematurely break out of the script tag */
function safeJsonForHtml(json: string): string {
  return json
    .replace(/<\//g, "<\\/") // </script> safe
    .replace(/</g, "\\u003C") // any remaining <
    .replace(/-->/g, "--\\>") // HTML comment edge
    .replace(/\u2028/g, "\\u2028") // line sep
    .replace(/\u2029/g, "\\u2029"); // paragraph sep
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
