import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import WhyTrustUs from "@/components/about/WhyTrustUs";
import FullAgentProfiles from "@/components/about/FullAgentProfiles";
import OfficeLocation from "@/components/about/OfficeLocation";

export const metadata: Metadata = {
  title: "About Us — Meridian Properties NG",
  description:
    "Learn about Meridian Properties NG — a Port Harcourt property agency committed to verified, transparent property transactions across Rivers State.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHero />
      <CompanyStory />
      <WhyTrustUs />
      <FullAgentProfiles />
      <OfficeLocation />
    </div>
  );
}
