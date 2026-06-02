import { Metadata } from "next";
import { properties } from "@/lib/data/properties";
import PropertiesClient from "@/components/properties/PropertiesClient";

export const metadata: Metadata = {
  title: "All Properties — Meridian Properties NG",
  description:
    "Browse verified properties for sale, rent, and short-let across Port Harcourt. GRA, Woji, Eliozu, Ada George and beyond. CAC Registered. NIESV Affiliated.",
};

export default function PropertiesPage() {
  return <PropertiesClient properties={properties} />;
}
