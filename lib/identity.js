// /lib/identity.js

// ── Stable identity anchors — DO NOT CHANGE (schema.org @id IRIs)
export const PERSON_ID = "https://calebgridley.com/#person";
export const ORG_ID    = "https://popographer.com/#org";

// ── Canonical origins (single source of truth)
export const SITE_ORIGIN = "https://calebgridley.com";
export const CDN_ORIGIN  = "https://cdn.calebgridley.com";

// ── Organization (publisher) facts
export const ORG_NAME     = "Popographer";
// Public image URL for the logo (used as ImageObject.url)
export const ORG_LOGO_URL = "https://images.squarespace-cdn.com/content/66fde070bf644e552e3c778e/1a403812-82a6-4520-bead-560e6d2f1c77/popgrapher-logo.png";
// Stable @id for the logo node (used as ImageObject @id)
export const ORG_LOGO_ID  = "https://popographer.com/#logo";
export const LICENSE_URL  = "https://popographer.com/licensing/";

// ── Person facts
export const PERSON_NAME  = "Caleb Gridley";
export const PERSON_ROLES = ["Visual Artist", "Photographer", "Art Film Director"];

// External profiles (identity-equivalent)
export const PERSON_SAME_AS = [
  "https://popographer.com/about/",
  "https://www.instagram.com/thepopographer/"
];

// Email: keep both forms for convenience/back-compat
export const PERSON_CONTACT_EMAIL_PLAIN  = "caleb@popographer.com";
export const PERSON_CONTACT_EMAIL_MAILTO = "mailto:caleb@popographer.com";
// Back-compat export (some files import this name)
export const PERSON_CONTACT_EMAIL = PERSON_CONTACT_EMAIL_PLAIN;

// ── Popographer canonicals (trailing slashes)
export const POP_WORK_URLS = {
  "not-warhol":             "https://popographer.com/artwork/not-warhol/",
  "anointing-the-artifice": "https://popographer.com/artwork/anointing-the-artifice/",
  "body-of-work":           "https://popographer.com/artwork/body-of-work/",
  "augmentations":          "https://popographer.com/artwork/augmentations/"
};
