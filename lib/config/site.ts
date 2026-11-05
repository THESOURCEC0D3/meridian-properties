/**
 * Single source of truth for the agency's identity and contact channels.
 *
 * Before this existed the phone number was written literally in nine files and
 * the office address in three. Anything rendered in more than one place — or
 * needed by both a component and a metadata/JSON-LD file — belongs here.
 */

export const siteConfig = {
  name: "Meridian Properties NG",
  shortName: "Meridian Properties",
  locality: "Port Harcourt",
  region: "Rivers State",
  country: "NG",

  tagline: "Port Harcourt's Most Trusted Property Agency",
  description:
    "Find verified properties for sale, rent, and short-let in Port Harcourt. Verified titles, transparent pricing. Serving GRA, Woji, Eliozu, Ada George and beyond.",

  foundedYear: 2016,

  address: {
    street: "14 Tombia Street",
    area: "GRA Phase 2",
    city: "Port Harcourt",
    region: "Rivers State",
    country: "Nigeria",
  },

  /** E.164 digits without the leading "+", as required by wa.me links. */
  whatsapp: "2340000000000",
  /** Same number in E.164 for tel: links. */
  phoneE164: "+2340000000000",
  /** Human-readable form for display. */
  phoneDisplay: "0800 000 0000",
  email: "info@meridianpropertiesng.com",

  officeHours: {
    weekdays: "Mon — Fri: 8am — 6pm",
    saturday: "Saturday: 9am — 4pm",
  },

  /**
   * Registration details. A CAC number and professional body membership are the
   * two credentials a fraud-cautious Nigerian buyer actually checks, and the
   * site previously claimed trustworthiness without showing either.
   */
  credentials: {
    rcNumber: "RC 1482093",
    niesv: "NIESV Member — Rivers State Branch",
    esvarbon: "ESVARBON Registered",
  },
} as const;

/** Full address on one line, for display and for map queries. */
export const formattedAddress = `${siteConfig.address.street}, ${siteConfig.address.area}, ${siteConfig.address.city}, ${siteConfig.address.region}`;

/**
 * Canonical origin, used by metadataBase, the sitemap, robots, and JSON-LD.
 * Set SITE_URL in the deployment environment; falls back to localhost for dev
 * so every absolute-URL feature works without configuration.
 */
export const siteUrl = (
  process.env.SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Builds a wa.me deep link with a pre-filled message.
 *
 * `phone` is annotated `string` rather than left to inference: because
 * `siteConfig` is `as const`, an inferred default would type the parameter as
 * the literal "2340000000000" and reject every real agent number.
 */
export function whatsappLink(
  message: string,
  phone: string = siteConfig.whatsapp,
) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
