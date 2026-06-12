import { Metadata } from "next";
import { properties } from "@/lib/data/properties";
import PropertiesClient from "@/components/properties/PropertiesClient";



export const metadata: Metadata = {
  title: "All Properties — Meridian Properties NG",
  description:
    "Browse verified properties for sale, rent, and short-let across Port Harcourt. GRA, Woji, Eliozu, Ada George and beyond.",
};



export default async function PropertiesPage() {
 
  await new Promise((resolve) => setTimeout(resolve, 1500));
 

  return <PropertiesClient properties={properties} />;
}
