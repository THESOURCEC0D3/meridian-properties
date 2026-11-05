import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import WhyTrustUs from "@/components/about/WhyTrustUs";
import FullAgentProfiles from "@/components/about/FullAgentProfiles";
import OfficeLocation from "@/components/about/OfficeLocation";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Meridian Properties NG — a Port Harcourt property agency committed to verified, transparent property transactions across Rivers State.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Meridian Properties NG",
    description:
      "A Port Harcourt property agency built on verified titles and transparent, all-in pricing. CAC registered, NIESV member agents.",
    url: "/about",
  },
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
