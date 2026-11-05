import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Section from "@/components/shared/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import { areas } from "@/lib/data/areas";
import { getPropertiesByArea } from "@/lib/data/properties";

/**
 * Geographic entry point into the inventory.
 *
 * Most property buyers think in neighbourhoods before they think in property
 * types — "somewhere in GRA under ₦300m", not "a detached duplex". The site
 * previously offered no geographic navigation at all, only a slug dropdown on
 * the listings page.
 *
 * This section does four jobs at once: it demonstrates the local expertise the
 * whole positioning rests on, gives users a second way into the listings, uses
 * the now-working `?area=` URL filter, and finally puts the previously-dead
 * `getPropertiesByArea` helper to work.
 *
 * Areas with no current inventory are hidden rather than linking to an empty
 * result — a dead end is worse than an absence.
 */
export default function BrowseByArea() {
  const areasWithStock = areas
    .map((area) => ({ ...area, count: getPropertiesByArea(area.slug).length }))
    .filter((area) => area.count > 0);

  return (
    <Section className="bg-slate-50">
      <SectionHeader
        eyebrow="Know the City"
        title="Browse by Neighbourhood"
        description="Not sure where to look? Here is how Port Harcourt actually breaks down — and what we currently have in each area."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {areasWithStock.map((area) => (
          <Link
            key={area.slug}
            href={`/properties?area=${area.slug}`}
            className="group bg-white rounded-xl border border-slate-200 p-6 flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <MapPin
                  className="w-4 h-4 text-blue-600 shrink-0"
                  aria-hidden="true"
                />
                <h3 className="font-semibold text-slate-900">{area.label}</h3>
              </div>
              <span className="text-xs font-medium text-slate-600 bg-slate-100 rounded-full px-2.5 py-1 shrink-0">
                {area.count}
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed flex-1">
              {area.blurb}
            </p>

            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 mt-4">
              View {area.count === 1 ? "property" : "properties"}
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
