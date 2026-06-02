import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/properties/PropertyCard";
import { getFeaturedProperties } from "@/lib/data/properties";

const featuredProperties = getFeaturedProperties();

export default function FeaturedProperties() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">
              Hand-Picked Listings
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Properties
            </h2>
          </div>
          <Link href="/properties" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/properties">
            <Button variant="outline" className="gap-2">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
