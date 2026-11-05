import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import FavouriteButton from "@/components/properties/FavouriteButton";
import {
  Property,
  formatAmount,
  formatPrice,
  getAgentById,
  totalMoveInCost,
} from "@/lib/data/properties";
import { siteUrl } from "@/lib/config/site";

interface PropertyCardProps {
  property: Property;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  sale: { label: "For Sale", color: "bg-blue-600" },
  let: { label: "To Let", color: "bg-green-600" },
  shortlet: { label: "Short Let", color: "bg-purple-600" },
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const agent = getAgentById(property.agentId);
  const typeInfo = typeLabels[property.type];
  const href = `/properties/${property.id}`;

  // The URL lets the agent open the exact listing instead of matching a title by
  // hand — two listings here both begin "3-Bedroom Flat".
  const whatsappMessage = `Hello, I am interested in this property: ${property.title} at ${property.location}.\n${siteUrl}${href}\nPlease provide more details.`;

  const moveInTotal = totalMoveInCost(property);

  return (
    /* The whole card is the link target, not just the small button. Users
       expect it, and a ~380px card is a far easier target than a 28px button —
       which matters most on mobile, where a mis-tap opens the wrong property.
       The action buttons sit in a sibling layer stacked above the overlay. */
    <article className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 flex flex-col focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2">
      <Link
        href={href}
        className="absolute inset-0 z-10 focus:outline-none"
        aria-label={`View details for ${property.title} in ${property.location}`}
      />

      {/* Image */}
      <div className="relative h-52 w-full">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`${typeInfo.color} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}
          >
            {typeInfo.label}
          </span>
        </div>

        {/* Stacked above the card-wide link so saving does not navigate. */}
        <FavouriteButton
          propertyId={property.id}
          propertyTitle={property.title}
          className="absolute top-2 right-2 z-20"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* The title carries the most visual weight: it is what a visitor scans
            to decide whether to look closer, so it outranks the spec row. It was
            previously text-sm, subordinate to the price and the badges. */}
        <h3 className="font-semibold text-slate-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <MapPin
            className="w-3.5 h-3.5 text-slate-500 shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-slate-600">{property.location}</span>
        </div>

        {property.bedrooms > 0 && (
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-600">
                {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span className="text-xs text-slate-600">
                {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize2
                className="w-3.5 h-3.5 text-slate-500"
                aria-hidden="true"
              />
              <span className="text-xs text-slate-600">
                {property.size} sqm
              </span>
            </div>
          </div>
        )}

        {/* Title type appears once now. It previously rendered twice — as an
            image overlay and again as this row — and showed on short-lets, where
            a Certificate of Occupancy means nothing to a two-night guest. */}
        {property.type !== "shortlet" && (
          <div className="flex items-center gap-1 mb-3">
            <CheckCircle
              className="w-3.5 h-3.5 text-green-600 shrink-0"
              aria-hidden="true"
            />
            <span className="text-xs text-green-700 font-medium">
              Title: {property.titleType}
            </span>
          </div>
        )}

        <div className="mb-3 mt-auto">
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(property.price, property.type)}
          </p>
          {moveInTotal && (
            <p className="text-xs text-slate-600 mt-0.5">
              Total move-in cost:{" "}
              <span className="font-medium text-slate-800">
                {formatAmount(moveInTotal)}
              </span>
            </p>
          )}
        </div>

        {/* Stacked above the card-wide link so both stay clickable. */}
        <div className="relative z-20 flex gap-2 pt-3 border-t border-slate-100">
          <Button asChild variant="outline" className="flex-1 text-xs">
            <Link href={href}>View Details</Link>
          </Button>
          <WhatsAppButton
            phone={agent?.whatsapp}
            message={whatsappMessage}
            label="Enquire on WhatsApp"
            className="flex-1 text-xs"
          />
        </div>
      </div>
    </article>
  );
}
