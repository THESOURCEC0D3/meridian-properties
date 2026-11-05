import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPropertyById,
  getAgentById,
  properties,
  formatPrice,
  formatAmount,
  totalMoveInCost,
  type PropertyType,
} from "@/lib/data/properties";
import PropertyGallery from "@/components/properties/PropertyGallery";
import PropertyDetailClient from "@/components/properties/PropertyDetailClient";
import SimilarProperties from "@/components/properties/SimilarProperties";
import PropertySchema from "@/components/properties/PropertySchema";
import LocationMap from "@/components/shared/LocationMap";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import MobileCtaBar from "@/components/properties/MobileCtaBar";
import { getAreaBySlug } from "@/lib/data/areas";
import { siteConfig, siteUrl, whatsappLink } from "@/lib/config/site";
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
  MessageCircle,
  BadgeCheck,
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
    return { title: "Property Not Found" };
  }

  // Leading with price and location makes the search snippet and the WhatsApp
  // preview answer the two questions a browser has before they click.
  const description = `${formatPrice(property.price, property.type)} — ${
    property.title
  } in ${property.location}. ${property.description.slice(0, 100)}...`;

  return {
    title: property.title,
    description,
    alternates: { canonical: `/properties/${property.id}` },
    openGraph: {
      type: "article",
      title: `${formatPrice(property.price, property.type)} — ${property.title}`,
      description,
      url: `/properties/${property.id}`,
    },
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

  // Shared with PropertyCard, which computed the same sum inline.
  const moveInTotal = totalMoveInCost(property);

  const typeLabels: Record<PropertyType, string> = {
    sale: "For Sale",
    let: "To Let",
    shortlet: "Short Let",
  };

  // The trust panel is keyed on transaction type: a guest booking two nights
  // is not buying anything, and title documents are meaningless to them.
  // Typing this as Record<PropertyType, …> makes TypeScript demand an entry
  // for every type, so adding a fourth type can't silently skip this panel.
  const trustPanels: Record<
    PropertyType,
    { heading: string; signals: string[] }
  > = {
    sale: {
      heading: "Why Buy Through Meridian?",
      signals: [
        "Verified title documents",
        "Transparent pricing — no hidden fees",
        "Direct contact with a local agent",
        "Honest guidance from start to finish",
        "Diaspora-friendly process",
      ],
    },
    let: {
      heading: "Why Rent Through Meridian?",
      signals: [
        "Ownership and title verified before listing",
        "Full move-in cost shown upfront",
        "Direct contact with a local agent",
        "No surprise fees at signing",
        "Honest guidance from start to finish",
      ],
    },
    shortlet: {
      heading: "Why Book Through Meridian?",
      signals: [
        "Every apartment inspected before listing",
        "Transparent nightly rate — no hidden charges",
        "Direct contact with the local desk",
        "Power and water backup confirmed",
        "Fast WhatsApp response",
      ],
    },
  };

  const trustPanel = trustPanels[property.type];

  // Breadcrumb uses the readable area name, not the URL slug.
  const areaLabel = getAreaBySlug(property.area)?.label ?? property.location;

  const listingUrl = `${siteUrl}/properties/${property.id}`;
  const agentFirstName = agent?.name.split(" ")[0] ?? "Meridian Properties";

  // Both messages carry the listing URL so the agent can open the exact property
  // instead of matching a title by hand.
  const whatsappMessage = `Hello ${agentFirstName}, I have a question about this property: ${property.title} at ${property.location}.\n${listingUrl}`;

  const viewingMessage = `Hello ${agentFirstName}, I would like to arrange a viewing of this property:\n${property.title} — ${property.location}\n${listingUrl}\n\nMy preferred days are: `;

  return (
    <div className="min-h-screen bg-slate-50">
      <PropertySchema property={property} agent={agent} />

      {/* Breadcrumbs + share */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: areaLabel, href: `/properties?area=${property.area}` },
              { label: property.title },
            ]}
          />
          <PropertyDetailClient propertyTitle={property.title} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*
          Three grid children rather than two, so the reading order differs by
          breakpoint without duplicating any markup:

            mobile  →  gallery + header, then PRICE + CTA, then the long content
            desktop →  gallery + header top-left, long content beneath it,
                       sidebar in the right column spanning both rows

          Previously the sidebar was the second of two children, so collapsing to
          one column pushed the price and every call to action below the full
          description and a fourteen-item feature grid. A responsive grid
          reorders columns; it silently dictates mobile sequence.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1 — Gallery + identity */}
          <div className="order-1 lg:col-span-2 lg:col-start-1 lg:row-start-1 flex flex-col gap-6">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Property Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {typeLabels[property.type]}
                </span>
                {/* Title type matters to a buyer or tenant. It is noise to
                    someone booking a two-night stay, so it is omitted there. */}
                {property.type !== "shortlet" && (
                  <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Title: {property.titleType}
                  </span>
                )}
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
          </div>

          {/* 3 — Long-form content. Declared after the sidebar in the DOM so
              mobile gets price and CTA first; placed in row 2 on desktop. */}
          <div className="order-3 lg:col-span-2 lg:col-start-1 lg:row-start-2 flex flex-col gap-6">
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

            {/* Location — the primary decision variable in property, and
                previously available only as a line of plain text. */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Location
              </h2>
              <p className="text-sm text-slate-600 mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                {property.location}
              </p>
              <LocationMap
                query={property.location}
                title={`Map showing the location of ${property.title}`}
                heightClassName="h-72 md:h-80"
              />
            </div>

            <SimilarProperties property={property} />
          </div>

          {/* 2 — Sidebar: price, CTAs, agent, trust. Right column on desktop,
              spanning both rows; second in the flow on mobile, directly under
              the gallery.

              The whole column is sticky, not just the price card. With only the
              card sticky, the agent and trust cards kept scrolling and slid
              underneath it — a sticky element paints above its unpositioned
              siblings, so they overlapped. Moving as one unit, they can't.

              lg:self-start — a grid item stretches to fill both rows by default,
                and a sticky element as tall as its container has nowhere to
                stick. self-start shrinks it to its content height.
              max-h + overflow-y-auto — the column is taller than most laptop
                screens, so it scrolls internally instead of hiding the bottom
                cards off-screen. The height is the viewport minus the top-24
                offset and 1.5rem of breathing room at the bottom. dvh rather
                than vh so mobile browser toolbars don't miscalculate it. */}
          <div className="order-2 lg:col-start-3 lg:row-start-1 lg:row-span-2 flex flex-col gap-6 lg:self-start lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7.5rem)] lg:overflow-y-auto lg:[scrollbar-width:thin]">
            {/* Price Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              {/* Price */}
              <div className="mb-4 pb-4 border-b border-slate-100">
                <p className="text-3xl font-bold text-slate-900">
                  {formatPrice(property.price, property.type)}
                </p>
                {property.minNights && (
                  <p className="text-sm text-slate-500 mt-1">
                    Minimum {property.minNights}-night stay
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              {property.priceBreakdown && (
                <div className="mb-4 pb-4 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 mb-3">
                    Full Move-In Cost Breakdown
                  </p>
                  {/* formatAmount replaces five calls to
                      `formatPrice(x, type).replace("/year", "")` — the old code
                      appended a period suffix and then stripped it again. */}
                  <dl className="flex flex-col gap-2">
                    {[
                      { label: "Annual Rent", value: property.priceBreakdown.rent },
                      {
                        label: "Agency Fee (10%)",
                        value: property.priceBreakdown.agencyFee,
                      },
                      {
                        label: "Legal Fee (10%)",
                        value: property.priceBreakdown.legalFee,
                      },
                      {
                        label: "Caution Deposit",
                        value: property.priceBreakdown.cautionDeposit,
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="flex justify-between text-sm"
                      >
                        <dt className="text-slate-600">{row.label}</dt>
                        <dd className="text-slate-900 font-medium">
                          {formatAmount(row.value)}
                        </dd>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-100">
                      <dt className="text-slate-900">Total Move-In Cost</dt>
                      <dd className="text-blue-700">
                        {moveInTotal && formatAmount(moveInTotal)}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* CTA Buttons.
                  "Request a viewing" leads because the inspection booking — not
                  the general enquiry — is the micro-conversion that actually
                  predicts a transaction. "I'm interested" is a browsing signal;
                  "can I see it Saturday" is a buying signal, and the site had no
                  way to express the second one. */}
              <div className="flex flex-col gap-3">
                <WhatsAppButton
                  phone={agent?.whatsapp}
                  message={viewingMessage}
                  label="Request a Viewing"
                  className="w-full"
                />
                {/* A plain outline Button rather than WhatsAppButton: this is a
                    secondary action, and WhatsAppButton hardcodes the green
                    brand fill. Overriding that with !important would be fighting
                    the component instead of choosing the right one. */}
                <Button asChild variant="outline" className="w-full gap-2">
                  <a
                    href={whatsappLink(whatsappMessage, agent?.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    Ask a Question
                    <span className="sr-only">
                      {" "}
                      on WhatsApp (opens in a new tab)
                    </span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full gap-2">
                  <a href={`tel:+${agent?.phone ?? siteConfig.whatsapp}`}>
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Call {agent?.phoneDisplay ?? siteConfig.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>

            {/* Agent Card */}
            {agent && (
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Listed By
                </h3>
                <div className="flex items-start gap-4">
                  {/* Monogram rather than a generic "group of people" icon: this
                      is one named agent, and the site's claim is that you deal
                      with a person rather than a desk. */}
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 font-semibold">
                    {agent.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{agent.name}</p>
                    <p className="text-blue-700 text-sm">{agent.role}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {agent.specialisation}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <BadgeCheck
                        className="w-3.5 h-3.5 text-green-600 shrink-0"
                        aria-hidden="true"
                      />
                      {agent.credential}
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
                {trustPanel.heading}
              </h3>
              <div className="flex flex-col gap-2">
                {trustPanel.signals.map((signal) => (
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

      {/* Extra bottom padding so the fixed bar never covers page content. */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <MobileCtaBar property={property} agent={agent} />
    </div>
  );
}
