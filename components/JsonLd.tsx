// components/JsonLd.tsx
import React from "react";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonObject = { [k: string]: JsonValue | undefined };
type JsonArray = JsonValue[];

type JsonLdProps = {
  id: string;
  /** Accept anything; we normalize it into JSON-safe data */
  data: unknown;
  /** Optional CSP nonce */
  nonce?: string;
  /** Optional marker to tag first-party scripts */
  dataOwned?: string;
  /** Optional route hint (e.g., "/identity/") */
  dataPath?: string;
};

/** Normalize arbitrary data into JSON-serializable domain (no functions/symbols). */
function normalizeToJsonValue(input: unknown, seen: WeakSet<object>): JsonValue | undefined {
  if (input === null) return null;

  if (typeof input === "string" || typeof input === "number" || typeof input === "boolean") {
    return input;
  }

  if (typeof input === "bigint") {
    // JSON has no BigInt — use explicit decimal string
    return input.toString();
  }

  if (input instanceof Date) return input.toISOString();
  if (typeof URL !== "undefined" && input instanceof URL) return input.toString();

  if (Array.isArray(input)) {
    const out: JsonArray = [];
    for (const item of input) {
      const v = normalizeToJsonValue(item, seen);
      out.push(v === undefined ? null : v); // keep indexes stable; drop unsupported as null
    }
    return out;
  }

  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;
    if (seen.has(obj)) return "[Circular]";

    seen.add(obj);

    // Honor custom toJSON() if provided
    const maybeToJSON = (obj as { toJSON?: () => unknown }).toJSON;
    if (typeof maybeToJSON === "function") {
      try {
        const jsonVal: unknown = maybeToJSON.call(obj);
        return normalizeToJsonValue(jsonVal, seen);
      } catch {
        /* fall through to plain-object path */
      }
    }

    const out: JsonObject = {};
    for (const key of Object.keys(obj).sort()) {
      const v = normalizeToJsonValue(obj[key], seen);
      if (v !== undefined) out[key] = v; // omit unsupported (functions/symbols/undefined)
    }
    return out;
  }

  // functions, symbols, and top-level undefined are omitted
  return undefined;
}

function toJsonText(data: unknown): string {
  const normalized = normalizeToJsonValue(data, new WeakSet<object>());
  const json = JSON.stringify(normalized ?? null);
  // Safe for embedding in <script type="application/ld+json">
  return json
    .replace(/<\/(script)/gi, "<\\/$1>")
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
  const json = React.useMemo(() => toJsonText(data), [data]);

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
