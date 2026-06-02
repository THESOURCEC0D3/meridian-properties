import Image from "next/image";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

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
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              CAC Registered · NIESV Affiliated · Verified Titles
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

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/properties">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                Browse Properties
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <WhatsAppButton
              phone="2348012345678"
              message="Hello, I would like to find a property in Port Harcourt. Can you help me?"
              label="Talk to an Agent"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
