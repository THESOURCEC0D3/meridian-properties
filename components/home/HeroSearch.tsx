"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areas, propertyTypes } from "@/lib/data/filters";

/**
 * Hero search.
 *
 * Every established property portal opens with one, because a visitor arrives
 * with criteria already in mind — an area, a budget, a type. The previous hero
 * offered only a "Browse Properties" button, which asked the user to discard
 * those criteria, load an undifferentiated grid of twelve, and rebuild them in
 * the filter bar on the next page.
 *
 * This turns intent into a filtered result in one action. It deliberately
 * navigates to the same `?type=&area=` URL contract the filter bar and footer
 * links use, so there is one way to express a search across the whole site
 * rather than a parallel mechanism.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [type, setType] = useState("all");
  const [area, setArea] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (area !== "all") params.set("area", area);
    const query = params.toString();
    router.push(query ? `/properties?${query}` : "/properties");
  };

  return (
    <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label
            htmlFor="hero-search-type"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            I&apos;m looking to
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="hero-search-type" className="w-full">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="hero-search-area"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Area
          </label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger id="hero-search-area" className="w-full">
              <SelectValue placeholder="All areas" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto gap-2 h-10"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
