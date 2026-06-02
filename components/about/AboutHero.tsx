import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative bg-slate-900 text-white py-16 md:py-24 min-h-screen flex items-center">
      <Image
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-30"
      />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-blue-400 font-medium text-sm uppercase tracking-wider mb-4">
            About Meridian Properties
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Port Harcourt&apos;s Most Trusted Property Agency
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Founded in 2016, Meridian Properties NG has built its reputation on
            one principle — honest, transparent property transactions with zero
            hidden fees and fully verified titles. We serve buyers, tenants,
            investors, and diaspora clients across Rivers State.
          </p>

          <div className="flex flex-wrap gap-4">
            {[
              "Verified Titles Only",
              "Transparent Pricing",
              "Diaspora-Friendly",
              "Local PH Expertise",
            ].map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2"
              >
                <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-white text-xs font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
