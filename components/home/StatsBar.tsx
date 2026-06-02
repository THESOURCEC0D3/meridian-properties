import { Home, Users, Award, Star } from "lucide-react";

const stats = [
  { icon: Home, label: "Properties Listed", value: "500+" },
  { icon: Users, label: "Happy Clients", value: "200+" },
  { icon: Award, label: "Years Experience", value: "8+" },
  { icon: Star, label: "5-Star Reviews", value: "150+" },
];

export default function StatsBar() {
  return (
    <div className="bg-slate-800 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg shrink-0">
                <stat.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
