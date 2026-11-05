"use client";

import { useState, useMemo } from "react";
import { Search, SearchX, SlidersHorizontal, X } from "lucide-react";
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
import {
  DEFAULT_FILTERS,
  FilterState,
  applyFilters,
  areas,
  bedroomOptions,
  filtersToQueryString,
  getPriceRanges,
  propertyTypes,
  sortOptions,
} from "@/lib/data/filters";

interface PropertiesClientProps {
  properties: Property[];
  initialFilters: FilterState;
}

export default function PropertiesClient({
  properties,
  initialFilters,
}: PropertiesClientProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Applies a filter change and mirrors it into the URL.
   *
   * `history.replaceState` is used instead of router navigation so filtering
   * stays instant — the URL becomes shareable without a server round trip on
   * every keystroke.
   */
  const updateFilters = (patch: Partial<FilterState>) => {
    const next = { ...filters, ...patch };
    setFilters(next);

    const query = filtersToQueryString(next);
    window.history.replaceState(
      null,
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
  };

  const activePriceRanges = getPriceRanges(filters.type);

  // The predicate itself lives in lib/data/filters so it has a single home.
  const filteredProperties = useMemo(
    () => applyFilters(properties, filters),
    [properties, filters],
  );

  // Sort is deliberately excluded: it changes presentation, not the result set,
  // so "Clear filters" should not reset the user's chosen ordering.
  const hasActiveFilters =
    filters.query !== "" ||
    filters.type !== "all" ||
    filters.area !== "all" ||
    filters.price !== "all" ||
    filters.beds !== "all";

  const clearFilters = () =>
    updateFilters({ ...DEFAULT_FILTERS, sort: filters.sort });

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
      <div className="bg-white border-b border-slate-200 sticky top-nav z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by title or location..."
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.type}
              onValueChange={(value) =>
                updateFilters({ type: value, price: "all" })
              }
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

            <Select
              value={filters.area}
              onValueChange={(value) => updateFilters({ area: value })}
            >
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
              value={filters.beds}
              onValueChange={(value) => updateFilters({ beds: value })}
            >
              <SelectTrigger className="w-32" aria-label="Minimum bedrooms">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                {bedroomOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.price}
              onValueChange={(value) => updateFilters({ price: value })}
              disabled={filters.type === "all"}
            >
              <SelectTrigger className="w-44" aria-label="Price range">
                {filters.type === "all" ? (
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
                onClick={clearFilters}
                className="gap-2 text-slate-600 hover:text-slate-900 shrink-0"
              >
                <X className="w-4 h-4" aria-hidden="true" />
                Clear
              </Button>
            )}
          </div>

          {/* Mobile Filters Toggle */}
          <div className="flex md:hidden items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search properties..."
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
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
                value={filters.type}
                onValueChange={(value) =>
                  updateFilters({ type: value, price: "all" })
                }
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

              <Select
                value={filters.area}
                onValueChange={(value) => updateFilters({ area: value })}
              >
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
                value={filters.beds}
                onValueChange={(value) => updateFilters({ beds: value })}
              >
                <SelectTrigger className="w-full" aria-label="Minimum bedrooms">
                  <SelectValue placeholder="Beds" />
                </SelectTrigger>
                <SelectContent>
                  {bedroomOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.price}
                onValueChange={(value) => updateFilters({ price: value })}
                disabled={filters.type === "all"}
              >
                <SelectTrigger className="w-full" aria-label="Price range">
                  {filters.type === "all" ? (
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

              <Select
                value={filters.sort}
                onValueChange={(value) => updateFilters({ sort: value })}
              >
                <SelectTrigger className="w-full" aria-label="Sort results">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
        {/* Results Count + sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* aria-live announces the new count when a filter changes. Without it
              a screen reader user gets no feedback that filtering did anything. */}
          <p className="text-slate-700 text-sm" aria-live="polite">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProperties.length}
            </span>{" "}
            {filteredProperties.length === 1 ? "property" : "properties"}
            {hasActiveFilters && " matching your search"}
          </p>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-blue-700 text-sm hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                Clear filters
              </button>
            )}
            <div className="hidden md:flex items-center gap-2">
              <label
                htmlFor="sort-results"
                className="text-sm text-slate-700 shrink-0"
              >
                Sort by
              </label>
              <Select
                value={filters.sort}
                onValueChange={(value) => updateFilters({ sort: value })}
              >
                <SelectTrigger id="sort-results" className="w-44">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        {filteredProperties.length > 0 ? (
          // A list, so screen readers announce "list, 12 items" and users know
          // how much is here before reading through it. Bullets removed visually;
          // the semantics are what matter.
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
            {filteredProperties.map((property) => (
              <li key={property.id}>
                <PropertyCard property={property} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-20">
            {/* lucide rather than a 🏠 emoji: emoji render differently per OS,
                cannot be colour-matched, and are read aloud by screen readers. */}
            <SearchX
              className="w-12 h-12 text-slate-400 mx-auto mb-4"
              aria-hidden="true"
            />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No properties found
            </h3>
            <p className="text-slate-600 mb-6">
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
