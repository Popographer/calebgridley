// /lib/identity.ts
import type { WorkSlug } from "./types";

// ── Stable identity anchors — DO NOT CHANGE (schema.org @id IRIs)
export const PERSON_ID = "https://calebgridley.com/#person" as const;
export const ORG_ID    = "https://popographer.com/#org" as const;

// ── Canonical origins (single source of truth)
export const SITE_ORIGIN = "https://calebgridley.com" as const;
export const CDN_ORIGIN  = "https://cdn.calebgridley.com" as const;

// ── Organization (publisher) facts
export const ORG_NAME = "Popographer" as const;
// Public image URL for the logo (used as ImageObject.url)
export const ORG_LOGO_URL =
  "https://images.squarespace-cdn.com/content/66fde070bf644e552e3c778e/1a403812-82a6-4520-bead-560e6d2f1c77/popgrapher-logo.png" as const;
// Stable @id for the logo node (used as ImageObject @id)
export const ORG_LOGO_ID = "https://popographer.com/#logo" as const;
export const LICENSE_URL = "https://popographer.com/licensing/" as const;

// ── Person facts
export const PERSON_NAME  = "Caleb Gridley" as const;
export const PERSON_ROLES = [
  "Visual Artist",
  "Photographer",
  "Art Film Director",
] as const;
export type PersonRole = (typeof PERSON_ROLES)[number];

// External profiles (identity-equivalent)
export const PERSON_SAME_AS = [
  "https://popographer.com/about/",
  "https://www.instagram.com/thepopographer/",
] as const;

// Email: keep both forms for convenience/back-compat
export const PERSON_CONTACT_EMAIL_PLAIN  = "caleb@popographer.com" as const;
export const PERSON_CONTACT_EMAIL_MAILTO =
  (`mailto:${PERSON_CONTACT_EMAIL_PLAIN}`) as const;
// Back-compat export (some files import this name)
export const PERSON_CONTACT_EMAIL = PERSON_CONTACT_EMAIL_PLAIN;

// Ensure a mailto: form for schema usage.
export const emailForSchema = PERSON_CONTACT_EMAIL_PLAIN.startsWith("mailto:")
  ? (PERSON_CONTACT_EMAIL_PLAIN as `${string}`)
  : (`mailto:${PERSON_CONTACT_EMAIL_PLAIN}` as const);

// ── Popographer canonicals
// Typed as a subset of your WorkSlug union. This catches typos and keeps
// you from accidentally adding unknown slugs, while not forcing you to
// include every slug (e.g., no Popographer page for "caleb-gridley").
export const POP_WORK_URLS: Partial<Record<WorkSlug, string>> = {
  "not-warhol":    "https://popographer.com/artwork/not-warhol/",
  "body-of-work":  "https://popographer.com/artwork/body-of-work/",
  "augmentations": "https://popographer.com/artwork/augmentations/",
} as const;

// Safe accessor for canonical Popographer URL by slug
export function canonicalPopUrl(slug: WorkSlug): string | undefined {
  return POP_WORK_URLS[slug];
}
