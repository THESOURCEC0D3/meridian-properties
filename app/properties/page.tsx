import { Metadata } from "next";
import { properties } from "@/lib/data/properties";
import { parseFilters } from "@/lib/data/filters";
import PropertiesClient from "@/components/properties/PropertiesClient";



export const metadata: Metadata = {
  // The brand suffix comes from the root layout's title.template.
  title: "All Properties",
  description:
    "Browse verified properties for sale, rent, and short-let across Port Harcourt. GRA, Woji, Eliozu, Ada George and beyond.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "All Properties in Port Harcourt",
    description:
      "Browse verified properties for sale, rent, and short-let across Port Harcourt. Verified titles, full move-in costs shown upfront.",
    url: "/properties",
  },
};



interface PropertiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  // Filters arrive in the URL so that links like /properties?type=shortlet
  // (used across the footer) land on a pre-filtered page, and so any filtered
  // view can be bookmarked or shared.
  const initialFilters = parseFilters(await searchParams);

  return (
    <PropertiesClient
      properties={properties}
      initialFilters={initialFilters}
    />
  );
}
