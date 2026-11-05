import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import BrowseByArea from "@/components/home/BrowseByArea";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import AgentSection from "@/components/home/AgentSection";
import FaqSection from "@/components/home/FaqSection";
import CTABanner from "@/components/home/CTABanner";

/**
 * Section order follows the funnel: frame and capture intent, substantiate the
 * promise, show the product, offer a second way in, differentiate, explain the
 * process, prove it with third-party voices, introduce the people, handle
 * objections, then ask.
 *
 * Testimonials now sit before AgentSection so third-party proof arrives before
 * the agency introduces its own staff — proof earns the introduction.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsBar />
      <FeaturedProperties />
      <BrowseByArea />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <AgentSection />
      <FaqSection />
      <CTABanner />
    </div>
  );
}
