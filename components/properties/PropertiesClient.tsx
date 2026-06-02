"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/lib/data/properties";

interface PropertiesClientProps {
  properties: Property[];
}

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "let", label: "To Let" },
  { value: "shortlet", label: "Short Let" },
];

const areas = [
  { value: "all", label: "All Areas" },
  { value: "gra", label: "GRA" },
  { value: "woji", label: "Woji" },
  { value: "eliozu", label: "Eliozu" },
  { value: "ada-george", label: "Ada George" },
  { value: "trans-amadi", label: "Trans-Amadi" },
  { value: "rumuola", label: "Rumuola" },
  { value: "peter-odili", label: "Peter Odili Road" },
  { value: "eneka", label: "Eneka" },
];

const priceRanges = {
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

export default function PropertiesClient({
  properties,
}: PropertiesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const activePriceRanges =
    selectedType === "all"
      ? priceRanges.all
      : priceRanges[selectedType as keyof typeof priceRanges];

const filteredProperties = useMemo(() => {
  return properties.filter((property) => {
    const matchesSearch =
      searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" || property.type === selectedType;

    const matchesArea =
      selectedArea === "all" || property.area === selectedArea;

    const matchesPrice = (() => {
      if (selectedPrice === "all") return true;
      const [min, max] = selectedPrice.split("-").map(Number);
      return property.price >= min && property.price <= max;
    })();

    return matchesSearch && matchesType && matchesArea && matchesPrice;
  });
}, [properties, searchQuery, selectedType, selectedArea, selectedPrice]);

 const hasActiveFilters =
   searchQuery !== "" ||
   selectedType !== "all" ||
   selectedArea !== "all" ||
   selectedPrice !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedArea("all");
    setSelectedPrice("all");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            All Properties
          </h1>
          <p className="text-slate-400">
            Verified listings across Port Harcourt and Rivers State
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={selectedType}
              onValueChange={(value) => {
                setSelectedType(value);
                setSelectedPrice("all");
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.value} value={area.value}>
                    {area.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedPrice}
              onValueChange={setSelectedPrice}
              disabled={selectedType === "all"}
            >
              <SelectTrigger className="w-48">
                {selectedType === "all" ? (
                  <span className="text-muted-foreground">
                    Select a type first
                  </span>
                ) : (
                  <SelectValue placeholder="Price Range" />
                )}
              </SelectTrigger>
              <SelectContent>
                {activePriceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Mobile Filters Toggle */}
          <div className="flex md:hidden items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex flex-col gap-3">
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setSelectedPrice("all");
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedPrice}
                onValueChange={setSelectedPrice}
                disabled={selectedType === "all"}
              >
                <SelectTrigger className="w-full">
                  {selectedType === "all" ? (
                    <span className="text-muted-foreground">
                      Select a type first
                    </span>
                  ) : (
                    <SelectValue placeholder="Price Range" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {activePriceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2 text-slate-500 w-full justify-center"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600 text-sm">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProperties.length}
            </span>{" "}
            {filteredProperties.length === 1 ? "property" : "properties"}
            {hasActiveFilters && " matching your search"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 text-sm hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No properties found
            </h3>
            <p className="text-slate-500 mb-6">
              No properties match your current search. Try adjusting your
              filters.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
