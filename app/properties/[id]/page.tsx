import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPropertyById,
  getAgentById,
  properties,
  formatPrice,
} from "@/lib/data/properties";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  CheckCircle,
  Phone,
  ArrowLeft,
  Users,
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return { title: "Property Not Found — Meridian Properties NG" };
  }

  return {
    title: `${property.title} — Meridian Properties NG`,
    description: `${property.description.slice(0, 155)}...`,
  };
}

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  const agent = getAgentById(property.agentId);

  const totalMoveInCost = property.priceBreakdown
    ? property.priceBreakdown.rent +
      property.priceBreakdown.agencyFee +
      property.priceBreakdown.legalFee +
      property.priceBreakdown.cautionDeposit
    : null;

  const typeLabels: Record<string, string> = {
    sale: "For Sale",
    let: "To Let",
    shortlet: "Short Let",
  };

  const whatsappMessage = `Hello ${agent?.name ?? "Meridian Properties"}, I am interested in this property: ${property.title} located at ${property.location}. Please provide more details and arrange an inspection.`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Properties
          </Link>
          <PropertyDetailClient propertyTitle={property.title} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column — Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Property Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {typeLabels[property.type]}
                </span>
                <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Title: {property.titleType}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm">{property.location}</span>
              </div>

              {property.bedrooms > 0 && (
                <div className="flex flex-wrap items-center gap-6 py-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 font-medium">
                      {property.bedrooms}{" "}
                      {property.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 font-medium">
                      {property.bathrooms}{" "}
                      {property.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-700 font-medium">
                      {property.size} sqm
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Property Description
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Property Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              {/* Price */}
              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="text-3xl font-bold text-slate-900">
                  {formatPrice(property.price, property.type)}
                </p>
                {property.type === "shortlet" && (
                  <p className="text-sm text-slate-500 mt-1">
                    Minimum 2-night stay
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              {property.priceBreakdown && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    Full Move-In Cost Breakdown
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Annual Rent</span>
                      <span className="text-slate-900 font-medium">
                        {formatPrice(
                          property.priceBreakdown.rent,
                          property.type,
                        ).replace("/year", "")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Agency Fee (10%)</span>
                      <span className="text-slate-900 font-medium">
                        {formatPrice(
                          property.priceBreakdown.agencyFee,
                          property.type,
                        ).replace("/year", "")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Legal Fee (10%)</span>
                      <span className="text-slate-900 font-medium">
                        {formatPrice(
                          property.priceBreakdown.legalFee,
                          property.type,
                        ).replace("/year", "")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Caution Deposit</span>
                      <span className="text-slate-900 font-medium">
                        {formatPrice(
                          property.priceBreakdown.cautionDeposit,
                          property.type,
                        ).replace("/year", "")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-100">
                      <span className="text-slate-900">Total Move-In Cost</span>
                      <span className="text-blue-600">
                        {totalMoveInCost &&
                          formatPrice(totalMoveInCost, property.type).replace(
                            "/year",
                            "",
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <WhatsAppButton
                  phone={agent?.whatsapp ?? "2340000000000"}
                  message={whatsappMessage}
                  label="WhatsApp Agent"
                  className="w-full"
                />
                <a href={`tel:+${agent?.phone ?? "2340000000000"}`}>
                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </Button>
                </a>
              </div>
            </div>

            {/* Agent Card */}
            {agent && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Listed By
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{agent.name}</p>
                    <p className="text-blue-600 text-sm">{agent.role}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {agent.specialisation}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3">
                      {agent.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Signals */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Why Buy Through Meridian?
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  "Verified title documents",
                  "Transparent pricing — no hidden fees",
                  "Direct contact with a local agent",
                  "Honest guidance from start to finish",
                  "Diaspora-friendly process",
                ].map((signal) => (
                  <div key={signal} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="text-sm text-slate-700">{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
