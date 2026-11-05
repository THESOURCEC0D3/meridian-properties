import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Reveal from "@/components/shared/Reveal";

export default function CTABanner() {
  return (
    <section className="py-20 bg-slate-900 text-white">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
            {/* Styled to match the hero's secondary button exactly. Previously
                this was an outline button with black text while the hero's
                equivalent was translucent-on-dark — the same action presented two
                ways, which stops users learning what "primary" looks like. */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white w-full sm:w-auto gap-2"
            >
              <Link href="/properties">
                Browse All Properties
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Button>
            <WhatsAppButton
              phone="2340000000000"
              message="Hello, I am ready to find a property in Port Harcourt. Can an agent assist me?"
              label="WhatsApp an Agent"
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
                href="tel:+2340000000000"
                className="text-white font-semibold hover:text-blue-400 transition-colors"
              >
                0800 000 0000
              </a>
            </p>
          </div>

        </div>
      </Reveal>
    </section>
  );
}