// components/JsonLd.tsx
import React from "react";

type JsonLdProps = {
  id: string;
  data: unknown;        // accept anything; we stringify safely below
  nonce?: string;       // add this if you use a CSP
  dataOwned?: string;   // optional marker
  dataPath?: string;    // optional route hint
};

// JSON.stringify with a tiny replacer for common non-JSON values.
// Then escape sequences that could prematurely end the script tag.
function toJsonText(input: unknown): string {
  const text = JSON.stringify(
    input,
    (_k, v) => {
      if (v instanceof Date) return v.toISOString();
      if (typeof v === "bigint") return v.toString();
      if (typeof URL !== "undefined" && v instanceof URL) return v.toString();
      return v;
    }
  ) ?? "{}";

  return text
    .replace(/<\/(script)/gi, "<\\/$1>") // prevent </script> breakout
    .replace(/\u2028/g, "\\u2028")       // line separator
    .replace(/\u2029/g, "\\u2029");      // paragraph separator
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
