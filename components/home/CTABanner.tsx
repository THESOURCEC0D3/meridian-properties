import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function CTABanner() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow */}
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-4">
            Ready to Get Started?
          </p>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            Find Your Perfect Property in Port Harcourt Today
          </h2>

          {/* Subtext */}
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Talk to one of our agents today. No pressure, no hidden fees — just
            honest property advice from people who know Port Harcourt inside
            out.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/properties">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-black hover:bg-slate-800 hover:text-white w-full sm:w-auto gap-2"
              >
                Browse All Properties
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <WhatsAppButton
              phone="2348012345678"
              message="Hello, I am ready to find a property in Port Harcourt. Can an agent assist me?"
              label="Talk to an Agent Now"
              size="lg"
              className="w-full sm:w-auto"
            />
          </div>

          {/* Direct Call Option */}
          <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-800">
            <div className="bg-slate-800 p-2 rounded-full">
              <Phone className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-slate-400 text-sm">
              Prefer to call?{" "}
              <a
                href="tel:+2348012345678"
                className="text-white font-semibold hover:text-blue-400 transition-colors"
              >
                0801 234 5678
              </a>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}