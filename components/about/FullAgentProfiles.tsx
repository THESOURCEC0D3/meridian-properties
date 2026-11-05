import { Phone, MapPin, BadgeCheck, Briefcase } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { agents } from "@/lib/data/properties";
import Reveal from "@/components/shared/Reveal";

export default function FullAgentProfiles() {
  return (
    <section className="py-16 bg-white">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
            The People Behind Meridian
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Our Local Sales Teams
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto leading-relaxed">
            Every property is managed by a dedicated local sales desk you can
            reach directly — by phone or WhatsApp. Real local people, not an
            anonymous inbox.
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
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">
                    {agent.initials}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-0.5">
                  {agent.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{agent.role}</p>

                <div className="flex flex-col gap-1 mb-4">
                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Specialises in: {agent.specialisation}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <BadgeCheck
                      className="w-4 h-4 text-green-600 shrink-0"
                      aria-hidden="true"
                    />
                    {agent.credential}
                  </p>
                  <p className="text-sm text-slate-600 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {agent.yearsExperience} years in Port Harcourt property
                  </p>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {agent.bio}
                </p>

                {/* Contact Options */}
                <div className="flex flex-wrap gap-3">
                  <WhatsAppButton
                    phone={agent.whatsapp}
                    message={`Hello ${agent.name.split(" ")[0]}, I found your profile on the Meridian Properties website and I would like to enquire about a property.`}
                    label={`WhatsApp ${agent.name.split(" ")[0]}`}
                  />
                  <Button asChild variant="outline">
                    <a href={`tel:+${agent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                      {agent.phoneDisplay}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
