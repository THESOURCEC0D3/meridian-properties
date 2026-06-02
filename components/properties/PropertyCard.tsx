import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Property, formatPrice, getAgentById } from "@/lib/data/properties";

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

  const whatsappMessage = `Hello, I am interested in this property: ${property.title} located at ${property.location}. Please provide more details.`;

  const totalMoveInCost = property.priceBreakdown
    ? property.priceBreakdown.rent +
      property.priceBreakdown.agencyFee +
      property.priceBreakdown.legalFee +
      property.priceBreakdown.cautionDeposit
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
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
        <div className="absolute top-3 right-3">
          <span className="bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {property.titleType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500">{property.location}</span>
        </div>

        {/* Stats */}
        {property.bedrooms > 0 && (
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600">
                {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600">
                {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-600">
                {property.size} sqm
              </span>
            </div>
          </div>
        )}

        {/* Title Type Badge */}
        <div className="flex items-center gap-1 mb-3">
          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
          <span className="text-xs text-green-700 font-medium">
            Title: {property.titleType}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3 mt-auto">
          <p className="text-lg font-bold text-slate-900">
            {formatPrice(property.price, property.type)}
          </p>
          {totalMoveInCost && (
            <p className="text-xs text-slate-500 mt-0.5">
              Total move-in cost:{" "}
              <span className="font-medium text-slate-700">
                {formatPrice(totalMoveInCost, property.type).replace(
                  "/year",
                  "",
                )}
              </span>
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-slate-100">
          <Link href={`/properties/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View Details
            </Button>
          </Link>
          <WhatsAppButton
            phone={agent?.whatsapp ?? "2340000000000"}
            message={whatsappMessage}
            label="Enquire"
            size="sm"
            className="flex-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
