import { Phone } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { agents } from "@/lib/data/properties";

export default function FullAgentProfiles() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
            The People Behind Meridian
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Meet Our Agents
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            Every property at Meridian is managed by a named, experienced agent.
            No anonymous inboxes. No ghost numbers. Just real people you can
            call, WhatsApp, and meet in person.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              className={`bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-start ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-3xl">
                    {agent.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-0.5">
                  {agent.name}
                </h3>
                <p className="text-blue-600 font-medium mb-1">{agent.role}</p>
                <p className="text-sm text-slate-500 mb-4">
                  📍 Specialises in: {agent.specialisation}
                </p>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {agent.bio}
                </p>

                {/* Contact Options */}
                <div className="flex flex-wrap gap-3">
                  <WhatsAppButton
                    phone={agent.whatsapp}
                    message={`Hello ${agent.name}, I found your profile on Meridian Properties and I would like to enquire about a property.`}
                    label={`WhatsApp ${agent.name.split(" ")[0]}`}
                    size="sm"
                  />
                  <a href={`tel:+${agent.phone}`}>
                    <button className="flex items-center gap-2 border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors text-sm font-medium px-4 py-2 rounded-md">
                      <Phone className="w-4 h-4" />
                      Call {agent.name.split(" ")[0]}
                    </button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
