/**
 * Area metadata — the single source of truth for Port Harcourt neighbourhoods.
 *
 * The area slugs previously existed only as select options in the filter UI, so
 * a visitor relocating from Lagos saw "gra", "woji", "eliozu" and got no help
 * whatsoever. The site's core claim is local expertise; a bare slug list is the
 * opposite of demonstrating it.
 *
 * `filters.ts` derives its select options from this list, so the slugs cannot
 * drift between the filter menu and the area content.
 */

export interface Area {
  slug: string;
  label: string;
  /** One-line orientation for someone who does not know the city. */
  blurb: string;
}

export const areas: Area[] = [
  {
    slug: "gra",
    label: "GRA",
    blurb:
      "Port Harcourt's most established address. Wide tarred roads, embassies and oil-company executives. The highest prices in the city.",
  },
  {
    slug: "woji",
    label: "Woji",
    blurb:
      "Popular with young professional families. Good value against GRA, strong estate security, and steadily improving roads.",
  },
  {
    slug: "eliozu",
    label: "Eliozu",
    blurb:
      "Fast-growing residential belt on the Airport Road corridor. Newer builds, larger plots, and the best price per square metre.",
  },
  {
    slug: "ada-george",
    label: "Ada George",
    blurb:
      "Dense, well-connected and convenient. Mid-market rentals close to schools, markets and the city centre.",
  },
  {
    slug: "trans-amadi",
    label: "Trans-Amadi",
    blurb:
      "The city's industrial and oil-services hub. Warehouses, offices and logistics yards with heavy-vehicle access.",
  },
  {
    slug: "rumuola",
    label: "Rumuola",
    blurb:
      "Central and busy, straddling the Rumuola–Aba Road junction. Mixed residential and commercial with excellent access.",
  },
  {
    slug: "peter-odili",
    label: "Peter Odili Road",
    blurb:
      "A rising corridor linking Trans-Amadi to the Old Aba Road. Newer serviced developments and strong rental demand.",
  },
  {
    slug: "eneka",
    label: "Eneka",
    blurb:
      "On the northern edge of the city. Land and self-build plots at entry-level prices, popular with first-time investors.",
  },
];

export function getAreaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug);
}
