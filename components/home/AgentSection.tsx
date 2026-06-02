import { Users } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { agents } from "@/lib/data/properties";

export default function AgentsSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-1">
            Real People, Real Results
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Meet Our Agents
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            Every property is handled by a named, experienced agent — not a
            faceless inbox. Speak directly with the person managing your
            listing.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow duration-300"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-100 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-400" />
              </div>

              {/* Agent Info */}
              <h3 className="font-semibold text-slate-900 text-lg mb-0.5">
                {agent.name}
              </h3>
              <p className="text-blue-600 text-sm font-medium mb-1">
                {agent.role}
              </p>
              <p className="text-xs text-slate-500 mb-4">
                📍 {agent.specialisation}
              </p>

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4 mb-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {agent.bio}
                </p>
              </div>

              {/* WhatsApp CTA */}
              <WhatsAppButton
                phone={agent.whatsapp}
                message={`Hello ${agent.name}, I found your profile on Meridian Properties and I would like to enquire about a property.`}
                label={`WhatsApp ${agent.name.split(" ")[0]}`}
                size="sm"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
