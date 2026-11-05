import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import HeroSearch from "@/components/home/HeroSearch";
import { siteConfig } from "@/lib/config/site";

export default function HeroSection() {
  return (
    <section className="relative bg-slate-900 text-white">
      <Image
        src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="max-w-3xl hero-enter">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              Verified Titles · Transparent Pricing · Local Expertise
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Find Your Perfect Property in{" "}
            <span className="text-blue-400">Port Harcourt</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            Verified listings. Trusted agents. Zero stress. We connect buyers,
            tenants, and diaspora investors with the best properties across GRA,
            Woji, Eliozu, Ada George and beyond.
          </p>

          {/* Search first: a property visitor arrives with criteria already in
              mind, so the fastest path is to act on them here rather than load
              an unfiltered grid and rebuild them on the next page. */}
          <HeroSearch />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white w-full sm:w-auto"
              >
                Browse All Properties
                <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Button>
            </Link>
            <WhatsAppButton
              phone={siteConfig.whatsapp}
              message="Hello, I would like to find a property in Port Harcourt. Can you help me?"
              label="WhatsApp an Agent"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
