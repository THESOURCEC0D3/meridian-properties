import { ShieldCheck, Wallet, MapPin } from "lucide-react";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Verified Titles",
    text: "Every listing is checked for a genuine C of O or registered title before it goes live — so you know exactly what you're buying.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    text: "Full move-in costs shown upfront — rent, agency, legal, and caution fees. No hidden charges, no surprises.",
  },
  {
    icon: MapPin,
    title: "Real Local Expertise",
    text: "On-the-ground knowledge of GRA, Woji, Eliozu and beyond — honest guidance on the right area at a fair price.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">
            Why Meridian
          </p>
          <h2 className="text-3xl font-bold text-slate-900">
            Built on Trust, Not Hype
          </h2>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valueProps.map((vp) => (
            <div
              key={vp.title}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col"
            >
              <div className="bg-blue-100 w-11 h-11 rounded-lg flex items-center justify-center mb-4">
                <vp.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{vp.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{vp.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
