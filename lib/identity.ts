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

// ── ISNI (authoritative org identifier)
export const ORG_ISNI_VALUE = "0000000528230294" as const;
export const ORG_ISNI_URL =
  "https://isni.oclc.org/cbs/DB=1.2/CMD?ACT=SRCH&IKT=8006&TRM=ISN%3A0000000528230294&TERMS_OF_USE_AGREED=Y&terms_of_use_agree=send" as const;

// PropertyValue payload(s) you can drop into Organization.identifier
export const ORG_IDENTIFIERS = [
  {
    "@type": "PropertyValue",
    propertyID: "ISNI",
    value: ORG_ISNI_VALUE,
    url: ORG_ISNI_URL,
  },
] as const;

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
  // Wikidata person
  "https://www.wikidata.org/wiki/Q136239794",
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
export const POP_WORK_URLS: Partial<Record<WorkSlug, string>> = {
  "not-warhol":    "https://popographer.com/artwork/not-warhol/",
  "body-of-work":  "https://popographer.com/artwork/body-of-work/",
  "augmentations": "https://popographer.com/artwork/augmentations/",
} as const;

export function canonicalPopUrl(slug: WorkSlug): string | undefined {
  return POP_WORK_URLS[slug];
}

// ────────────────────────────────────────────────────────────────────────────
// Wikidata canonical IDs (keep external URLs exact)
// ────────────────────────────────────────────────────────────────────────────
export type WikidataURL = `https://www.wikidata.org/wiki/Q${number}`;

// Person
export const WD_PERSON_CALEB: WikidataURL = "https://www.wikidata.org/wiki/Q136239794";
// Organization
export const WD_ORG_POPOGRAPHER_LLC: WikidataURL = "https://www.wikidata.org/wiki/Q136242635";
// Works / series
export const WD_WORK_NOT_WARHOL: WikidataURL = "https://www.wikidata.org/wiki/Q136242688";
export const WD_WORK_AUGMENTATIONS: WikidataURL = "https://www.wikidata.org/wiki/Q136242700";
// Events / exhibitions
export const WD_EVENT_ANOINTING_THE_ARTIFICE_EXHIBITION: WikidataURL =
  "https://www.wikidata.org/wiki/Q136242725";

export const WIKIDATA_BY_SLUG: Partial<Record<WorkSlug, WikidataURL>> = {
  "not-warhol": WD_WORK_NOT_WARHOL,
  "augmentations": WD_WORK_AUGMENTATIONS,
} as const;

// Organization sameAs bundle (authoritative)
export const ORG_SAME_AS = [
  WD_ORG_POPOGRAPHER_LLC,
  ORG_ISNI_URL, // ← ISNI resolver page
] as const;

// High-level references for cross-domain subjectOf wiring
export const SUBJECT_OF_REFERENCES = {
  NOT_WARHOL_SERIES: WD_WORK_NOT_WARHOL,
  AUGMENTATIONS_SERIES: WD_WORK_AUGMENTATIONS,
  ANOINTING_THE_ARTIFICE_EXHIBITION: WD_EVENT_ANOINTING_THE_ARTIFICE_EXHIBITION,
} as const;
