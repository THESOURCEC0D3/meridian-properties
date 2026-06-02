import { CheckCircle } from "lucide-react";

const reasons = [
  {
    icon: "📋",
    title: "Verified Title Documents",
    description:
      "Every listing shows the actual title type — C of O, Deed of Assignment, or Governor's Consent. No vague 'good title' claims.",
  },
  {
    icon: "💰",
    title: "Transparent Pricing",
    description:
      "We show the full move-in cost breakdown — rent, agency fee, legal fee, and caution deposit — upfront. No hidden fees. Ever.",
  },
  {
    icon: "👤",
    title: "Direct Local Agents",
    description:
      "Every property is handled by a dedicated Meridian sales desk you can reach directly by phone and WhatsApp — real people with real local knowledge.",
  },
  {
    icon: "🌍",
    title: "Diaspora-Friendly",
    description:
      "We serve UK, US, and Canada-based Nigerians with video walkthroughs, document verification, and escrow payment options.",
  },
];

const trustSignals = [
  "Verified Titles Only",
  "Transparent Pricing",
  "Local PH Expertise",
  "Diaspora-Friendly",
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">
            Why Clients Trust Us
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Port Harcourt&apos;s Most Trusted Property Agency
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In a market where property fraud is a constant risk, we built our
            entire business on verification, transparency, and trust.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-4">{reason.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Signals Banner */}
        <div className="bg-blue-600 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-center md:text-left">
            <h3 className="text-xl font-bold mb-1">Verified &amp; Trusted</h3>
            <p className="text-blue-200 text-sm">
              Honest, transparent property dealings across Rivers State
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {trustSignals.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2"
              >
                <CheckCircle className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="text-white text-xs font-medium">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
