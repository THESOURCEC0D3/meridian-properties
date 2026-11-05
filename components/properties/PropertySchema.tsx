import JsonLd from "@/components/shared/JsonLd";
import { siteConfig, siteUrl } from "@/lib/config/site";
import type { Agent, Property } from "@/lib/data/properties";

/**
 * Per-listing structured data.
 *
 * Without this, a search engine reads a property page as prose that happens to
 * mention a number and a place name. With it, the page declares "this is a
 * 5-bedroom residence in Port Harcourt offered at ₦280,000,000" — which is what
 * enables price/bed/bath enrichment in results and inclusion in property search
 * surfaces.
 *
 * Modelled as an `Offer` wrapping an accommodation type rather than as a bare
 * Product, because the thing being offered is a residence with a floor area and
 * a room count, and schema.org has vocabulary for exactly that.
 */
export default function PropertySchema({
  property,
  agent,
}: {
  property: Property;
  agent?: Agent;
}) {
  const url = `${siteUrl}/properties/${property.id}`;

  // Short-lets are priced per night, everything else per unit / per year.
  const unitText =
    property.type === "shortlet"
      ? "NIGHT"
      : property.type === "let"
        ? "ANNUAL"
        : undefined;

  const accommodationType =
    property.bedrooms > 0
      ? "Residence"
      : property.type === "sale"
        ? "Place"
        : "CommercialProperty";

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": url,
    url,
    name: property.title,
    description: property.description,
    datePosted: `${siteConfig.foundedYear}-01-01`,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.location,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.country,
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      ...(unitText ? { unitText } : {}),
      seller: {
        "@type": "RealEstateAgent",
        "@id": `${siteUrl}/#organization`,
        name: siteConfig.name,
      },
    },
    about: {
      "@type": accommodationType,
      ...(property.bedrooms > 0
        ? {
            numberOfRooms: property.bedrooms,
            numberOfBathroomsTotal: property.bathrooms,
          }
        : {}),
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.size,
        unitCode: "MTK", // square metre
      },
      amenityFeature: property.features.map((feature) => ({
        "@type": "LocationFeatureSpecification",
        name: feature,
        value: true,
      })),
    },
  };

  if (agent) {
    data.agent = {
      "@type": "Person",
      name: agent.name,
      jobTitle: agent.role,
      telephone: `+${agent.phone}`,
    };
  }

  return <JsonLd data={data} />;
}
