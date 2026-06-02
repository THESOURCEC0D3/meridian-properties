import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AgentSection from "@/components/home/AgentSection";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <WhyChooseUs />
      <AgentSection />
      <Testimonials />
      <CTABanner />
    </div>
  );
}
