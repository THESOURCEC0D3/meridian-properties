/**
 * Shared filter configuration for the properties listing page.
 *
 * These options live outside the client component so that both the server
 * (validating incoming `?type=…&area=…` search params) and the client
 * (rendering the Select menus) read from a single source of truth.
 */

import { areas as areaData } from "./areas";

export interface FilterState {
  query: string;
  type: string;
  area: string;
  price: string;
  /** Minimum bedroom count, as a string so it round-trips through the URL. */
  beds: string;
  sort: string;
}

export const DEFAULT_FILTERS: FilterState = {
  query: "",
  type: "all",
  area: "all",
  price: "all",
  beds: "all",
  sort: "featured",
};

/**
 * Bedroom count is among the top three filters on every property portal and was
 * missing entirely. Expressed as a minimum ("3+ bedrooms") rather than an exact
 * match, which is how buyers actually think about it.
 */
export const bedroomOptions = [
  { value: "all", label: "Any beds" },
  { value: "1", label: "1+ beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
  { value: "5", label: "5+ beds" },
];

/**
 * Sorting was absent, which is table stakes on a listings page. "Featured first"
 * is the default because it is revenue-weighted merchandising — the agency's
 * highest-value inventory leads unless the visitor asks for something else.
 */
export const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "beds-desc", label: "Most bedrooms" },
  { value: "size-desc", label: "Largest first" },
];

export const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "let", label: "To Let" },
  { value: "shortlet", label: "Short Let" },
];

/**
 * Derived from the area metadata in `areas.ts` so the slug list cannot drift
 * between the filter menu, the Browse by Area section, and URL validation.
 */
export const areas = [
  { value: "all", label: "All Areas" },
  ...areaData.map((area) => ({ value: area.slug, label: area.label })),
];

export const priceRanges = {
  all: [{ value: "all", label: "Any Price" }],
  sale: [
    { value: "all", label: "Any Price" },
    { value: "0-50000000", label: "Under ₦50m" },
    { value: "50000000-150000000", label: "₦50m — ₦150m" },
    { value: "150000000-300000000", label: "₦150m — ₦300m" },
    { value: "300000000-999999999", label: "Above ₦300m" },
  ],
  let: [
    { value: "all", label: "Any Price" },
    { value: "0-2000000", label: "Under ₦2m/year" },
    { value: "2000000-5000000", label: "₦2m — ₦5m/year" },
    { value: "5000000-10000000", label: "₦5m — ₦10m/year" },
    { value: "10000000-999999999", label: "Above ₦10m/year" },
  ],
  shortlet: [
    { value: "all", label: "Any Price" },
    { value: "0-85000", label: "Under ₦85k/night" },
    { value: "85000-120000", label: "₦85k — ₦120k/night" },
    { value: "120000-999999999", label: "Above ₦120k/night" },
  ],
};

/** The price brackets valid for a given property type. */
export function getPriceRanges(type: string) {
  return priceRanges[type as keyof typeof priceRanges] ?? priceRanges.all;
}

/** Reads the first value of a search param that may arrive as an array. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Turns raw URL search params into a validated FilterState.
 *
 * Every value is checked against the option lists above, so a hand-typed or
 * stale URL (`?type=foo`) falls back to a safe default instead of putting the
 * UI into a state the Select menus cannot represent.
 */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): FilterState {
  const rawType = first(params.type);
  const type = propertyTypes.some((t) => t.value === rawType)
    ? (rawType as string)
    : DEFAULT_FILTERS.type;

  const rawArea = first(params.area);
  const area = areas.some((a) => a.value === rawArea)
    ? (rawArea as string)
    : DEFAULT_FILTERS.area;

  // Price brackets are type-specific, so a price is only valid once a concrete
  // type is selected. This mirrors the UI, which disables price until then.
  const rawPrice = first(params.price);
  const price = getPriceRanges(type).some((p) => p.value === rawPrice)
    ? (rawPrice as string)
    : DEFAULT_FILTERS.price;

  const rawBeds = first(params.beds);
  const beds = bedroomOptions.some((b) => b.value === rawBeds)
    ? (rawBeds as string)
    : DEFAULT_FILTERS.beds;

  const rawSort = first(params.sort);
  const sort = sortOptions.some((s) => s.value === rawSort)
    ? (rawSort as string)
    : DEFAULT_FILTERS.sort;

  return {
    query: first(params.q) ?? DEFAULT_FILTERS.query,
    type,
    area,
    price,
    beds,
    sort,
  };
}

/**
 * Serialises a FilterState back into a query string, omitting defaults so a
 * clean browse stays on a clean `/properties` URL.
 */
export function filtersToQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.query.trim() !== "") params.set("q", filters.query);
  if (filters.type !== DEFAULT_FILTERS.type) params.set("type", filters.type);
  if (filters.area !== DEFAULT_FILTERS.area) params.set("area", filters.area);
  if (filters.price !== DEFAULT_FILTERS.price) params.set("price", filters.price);
  if (filters.beds !== DEFAULT_FILTERS.beds) params.set("beds", filters.beds);
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set("sort", filters.sort);
  return params.toString();
}

/**
 * Applies filters and sorting to a property list.
 *
 * Lives here rather than inside the client component so the predicate has one
 * home — and so it can be reused by a server-rendered area page later without
 * being reimplemented.
 */
export function applyFilters<
  T extends {
    title: string;
    location: string;
    type: string;
    area: string;
    price: number;
    bedrooms: number;
    size: number;
    featured: boolean;
  },
>(items: T[], filters: FilterState): T[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    const matchesSearch =
      query === "" ||
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);

    const matchesType = filters.type === "all" || item.type === filters.type;
    const matchesArea = filters.area === "all" || item.area === filters.area;

    const matchesBeds =
      filters.beds === "all" || item.bedrooms >= Number(filters.beds);

    let matchesPrice = true;
    if (filters.price !== "all") {
      const [min, max] = filters.price.split("-").map(Number);
      matchesPrice = item.price >= min && item.price <= max;
    }

    return (
      matchesSearch && matchesType && matchesArea && matchesBeds && matchesPrice
    );
  });

  switch (filters.sort) {
    case "price-desc":
      return filtered.sort((a, b) => b.price - a.price);
    case "price-asc":
      return filtered.sort((a, b) => a.price - b.price);
    case "beds-desc":
      return filtered.sort((a, b) => b.bedrooms - a.bedrooms);
    case "size-desc":
      return filtered.sort((a, b) => b.size - a.size);
    default:
      // Featured first, then most expensive — the agency's highest-value stock
      // leads rather than whatever order the array happens to be in.
      return filtered.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price,
      );
  }
}
