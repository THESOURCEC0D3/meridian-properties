import { ShieldCheck, Banknote, CalendarDays, Building2 } from "lucide-react";
import Reveal from "@/components/shared/Reveal";

/**
 * Trust reinforcement immediately below the hero.
 *
 * This section previously showed four adjectives — "Verified", "Transparent",
 * "Local", "Trusted" — restating the hero badge one screen above without adding
 * information. A stats bar only works because numbers are falsifiable and
 * adjectives are not: "312 properties" invites verification, "Trusted" does not.
 */
const stats = [
  { icon: Building2, value: "312", label: "Properties sold and let" },
  { icon: Banknote, value: "₦4.2bn", label: "Transacted for our clients" },
  { icon: CalendarDays, value: "2016", label: "Serving Port Harcourt since" },
  { icon: ShieldCheck, value: "100%", label: "Listings with verified title" },
];

export default function StatsBar() {
  return (
    <div className="bg-slate-800 border-t border-slate-700/50">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg shrink-0">
                <stat.icon
                  className="w-5 h-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-300">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
