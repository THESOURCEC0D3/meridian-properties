import JsonLd from "@/components/shared/JsonLd";
import { agents } from "@/lib/data/properties";
import { siteConfig, siteUrl, formattedAddress } from "@/lib/config/site";

/**
 * RealEstateAgent structured data, emitted site-wide from the root layout.
 *
 * This is what lets a search engine understand that the site represents a
 * specific business, at a specific address, in a specific city — rather than
 * just a page containing those words. It is the signal behind local pack
 * results, which is the traffic that matters most for a business whose
 * differentiator is having a real office in GRA Phase 2.
 *
 * `RealEstateAgent` is a subtype of LocalBusiness, so it carries the address,
 * opening hours and contact fields Google expects for local results.
 */
export default function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    description: siteConfig.description,
    url: siteUrl,
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    foundingDate: String(siteConfig.foundedYear),
    image: `${siteUrl}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.street}, ${siteConfig.address.area}`,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.country,
    },
    areaServed: {
      "@type": "City",
      name: `${siteConfig.locality}, ${siteConfig.region}`,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "63",
      bestRating: "5",
    },
    employee: agents.map((agent) => ({
      "@type": "Person",
      name: agent.name,
      jobTitle: agent.role,
      telephone: `+${agent.phone}`,
    })),
    knowsAbout: [
      "Residential property sales",
      "Property lettings",
      "Short-let apartments",
      "Commercial and industrial property",
      "Property title verification",
      "Diaspora property purchase",
    ],
    slogan: siteConfig.tagline,
    // Human-readable address kept alongside the structured form so the same
    // string powers display, map queries, and schema.
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(formattedAddress)}`,
  };

  return <JsonLd data={data} />;
}
