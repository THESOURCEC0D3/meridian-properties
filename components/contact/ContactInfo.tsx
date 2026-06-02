import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const contactDetails = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "14 Tombia Street, GRA Phase 2, Port Harcourt, Rivers State",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0801 234 5678",
    href: "tel:+2348012345678",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "0801 234 5678",
    href: "https://wa.me/2348012345678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@meridianpropertiesng.com",
    href: "mailto:info@meridianpropertiesng.com",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon — Fri: 8am — 6pm\nSaturday: 9am — 4pm",
    href: null,
  },
];

export default function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">

      {/* Contact Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-6">
          Contact Details
        </h3>

        <div className="flex flex-col gap-5">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-3">
              <div className="bg-blue-50 p-2 rounded-lg shrink-0">
                <detail.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-0.5">
                  {detail.label}
                </p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      detail.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="text-sm text-slate-700 whitespace-pre-line">
                    {detail.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <WhatsAppButton
            phone="2348012345678"
            message="Hello, I would like to speak with an agent at Meridian Properties."
            label="WhatsApp Us Now"
            className="w-full"
          />
        </div>
      </div>

      {/* Response Time Card */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-2">
          We Respond Fast
        </h3>
        <p className="text-blue-200 text-sm leading-relaxed mb-4">
          WhatsApp enquiries are responded to within 30 minutes during office
          hours. Form submissions are routed directly to WhatsApp for the
          fastest possible response.
        </p>
        <div className="flex flex-col gap-2">
          {[
            "WhatsApp — within 30 minutes",
            "Phone calls — answered immediately",
            "Email — within 4 hours",
            "After hours — next morning by 9am",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
              <span className="text-sm text-blue-100">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CAC Card */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-1">
          Verified Business
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          You can verify our registration independently at the Corporate Affairs
          Commission.
        </p>
        <div className="flex flex-col gap-2">
          {[
            "CAC Reg: RC-1087432",
            "NIESV Affiliated",
            "ESVARBON Registered",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
              <span className="text-sm text-slate-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}