// components/JsonLd.tsx
import React from "react";

type JsonLdProps = {
  id: string;
  data: unknown;
  nonce?: string;
  dataOwned?: string;
  dataPath?: string;
};

function toJsonText(input: unknown): string {
  const seen = new WeakSet<object>();

  const text =
    JSON.stringify(
      input,
      (_k, v) => {
        // Common non-JSON values -> strings
        if (v instanceof Date) return v.toISOString();
        if (typeof v === "bigint") return v.toString();
        if (typeof URL !== "undefined" && v instanceof URL) return v.toString();

        // Guard against accidental circular structures
        if (v && typeof v === "object") {
          const obj = v as object;
          if (seen.has(obj)) return "[Circular]";
          seen.add(obj);

          // Deterministic key order for plain objects (not arrays / class instances)
          if (!Array.isArray(v) && v.constructor === Object) {
            const src = v as Record<string, unknown>;
            const out: Record<string, unknown> = {};
            for (const key of Object.keys(src).sort()) out[key] = src[key];
            return out;
          }
        }
        return v;
      }
    ) ?? "{}";

  return text
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

  const extra: (Partial<Record<`data-${string}`, string>> & { nonce?: string }) = {};
  if (nonce) extra.nonce = nonce;
  if (dataOwned) extra["data-owned"] = dataOwned;
  if (dataPath) extra["data-path"] = dataPath;

  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      {...extra}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
