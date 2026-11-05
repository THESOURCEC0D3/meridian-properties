import PropertyCard from "@/components/properties/PropertyCard";
import { getSimilarProperties, type Property } from "@/lib/data/properties";

/**
 * Keeps a rejected property from ending the session.
 *
 * A visitor on a detail page has already shown interest in a type and an area,
 * which makes this the highest-intent place on the site to offer alternatives.
 * Reuses PropertyCard rather than introducing a second card design, so the
 * listing grid and this row stay visually identical.
 *
 * Renders nothing when there are no comparable properties — an empty "Similar
 * Properties" heading is worse than no section.
 */
export default function SimilarProperties({
  property,
}: {
  property: Property;
}) {
  const similar = getSimilarProperties(property);

  if (similar.length === 0) return null;

  return (
    <section
      aria-labelledby="similar-properties-heading"
      className="bg-white rounded-xl border border-slate-200 p-6"
    >
      <h2
        id="similar-properties-heading"
        className="text-lg font-semibold text-slate-900 mb-1"
      >
        Similar Properties
      </h2>
      <p className="text-sm text-slate-600 mb-5">
        Other verified listings you may want to compare.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {similar.map((item) => (
          <PropertyCard key={item.id} property={item} />
        ))}
      </div>
    </section>
  );
}
