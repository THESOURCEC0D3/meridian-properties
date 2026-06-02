import { CheckCircle, X } from "lucide-react";

const comparisons = [
  {
    point: "Full title document disclosed on every listing",
    meridian: true,
    others: false,
  },
  {
    point: "Complete move-in cost breakdown shown upfront",
    meridian: true,
    others: false,
  },
  {
    point: "Dedicated local agent with direct WhatsApp on every property",
    meridian: true,
    others: false,
  },
  {
    point: "Transparent, no-hidden-fee transactions",
    meridian: true,
    others: false,
  },
  {
    point: "Diaspora-friendly video walkthroughs available",
    meridian: true,
    others: false,
  },
  {
    point: "No inspection fees before property confirmation",
    meridian: true,
    others: false,
  },
];

export default function WhyTrustUs() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
            The Meridian Difference
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Why Clients Trust Meridian Over Others
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nigeria loses over ₦100 billion yearly to fraudulent real estate
            transactions. We built every part of how we operate to protect our
            clients from becoming part of that statistic.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-slate-900 text-white">
            <div className="p-4 col-span-1">
              <p className="text-sm font-medium text-slate-400">
                What We Offer
              </p>
            </div>
            <div className="p-4 text-center border-l border-slate-700">
              <p className="text-sm font-bold text-white">Meridian</p>
            </div>
            <div className="p-4 text-center border-l border-slate-700">
              <p className="text-sm font-medium text-slate-400">Most Others</p>
            </div>
          </div>

          {/* Table Rows */}
          {comparisons.map((row, index) => (
            <div
              key={row.point}
              className={`grid grid-cols-3 border-t border-slate-100 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <div className="p-4 col-span-1">
                <p className="text-sm text-slate-700">{row.point}</p>
              </div>
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.meridian ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="p-4 flex items-center justify-center border-l border-slate-100">
                {row.others ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
