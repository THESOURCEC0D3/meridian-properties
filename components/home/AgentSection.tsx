import { MapPin, Phone, BadgeCheck } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import Section from "@/components/shared/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { agents } from "@/lib/data/properties";

/**
 * Named agents, not desks.
 *
 * The eyebrow here used to read "Real People, Real Results" above three
 * anonymous "Meridian Sales Team — X" entries with generic icon avatars and a
 * single shared phone number — promising exactly the two things the section
 * lacked, while the site elsewhere claimed "not a faceless inbox".
 */
export default function AgentSection() {
  return (
    <Section className="bg-slate-50">
      <SectionHeader
        eyebrow="The People You'll Deal With"
        title="Meet Your Agent"
        description="Every property is handled by one named agent with their own direct line — not a shared inbox. You will deal with the same person from first enquiry to handover."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <article
            key={agent.id}
            className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
              {agent.initials}
            </div>

            <h3 className="font-semibold text-slate-900 text-lg mb-0.5">
              {agent.name}
            </h3>
            <p className="text-blue-600 text-sm font-medium mb-2">
              {agent.role}
            </p>

            <p className="text-xs text-slate-600 flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              {agent.specialisation}
            </p>
            <p className="text-xs text-slate-600 flex items-center justify-center gap-1 mb-4">
              <BadgeCheck
                className="w-3 h-3 text-green-600 shrink-0"
                aria-hidden="true"
              />
              {agent.credential}
            </p>

            <div className="border-t border-slate-100 pt-4 mb-4 flex-1">
              <p className="text-sm text-slate-600 leading-relaxed">
                {agent.bio}
              </p>
              <p className="text-xs text-slate-500 mt-3">
                {agent.yearsExperience} years in Port Harcourt property
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <WhatsAppButton
                phone={agent.whatsapp}
                message={`Hello ${agent.name.split(" ")[0]}, I found your profile on the Meridian Properties website and I would like to enquire about a property.`}
                label={`WhatsApp ${agent.name.split(" ")[0]}`}
                className="w-full"
              />
              <Button asChild variant="outline" className="w-full">
                <a href={`tel:+${agent.phone}`}>
                  <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                  {agent.phoneDisplay}
                </a>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
