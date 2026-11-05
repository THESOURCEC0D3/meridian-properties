import { MapPin, Phone, Mail, Clock } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import LocationMap from "@/components/shared/LocationMap";
import { formattedAddress, siteConfig } from "@/lib/config/site";
import Reveal from "@/components/shared/Reveal";

const officeDetails = [
  {
    icon: MapPin,
    label: "Office Address",
    value: formattedAddress,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phoneDisplay,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Monday — Friday: 8am — 6pm | Saturday: 9am — 4pm",
  },
];

export default function OfficeLocation() {
  return (
    <section className="py-16 bg-slate-50">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
            Find Us
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Office</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            We have a real physical office you can walk into. No P.O. boxes, no
            virtual addresses — just a real place where real people work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map Embed */}
          <LocationMap
            query={formattedAddress}
            title={`Map showing the ${siteConfig.shortName} office at ${formattedAddress}`}
            heightClassName="h-80 lg:h-full min-h-80"
            className="rounded-2xl"
          />

          {/* Office Details */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="font-bold text-slate-900 text-lg mb-6">
                Contact Information
              </h3>

              <div className="flex flex-col gap-6">
                {officeDetails.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-lg shrink-0">
                      <detail.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium uppercase tracking-wider mb-0.5">
                        {detail.label}
                      </p>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {detail.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-4">
                  Prefer to reach us on WhatsApp? We respond within 30 minutes
                  during office hours.
                </p>
                <WhatsAppButton
                  phone="2340000000000"
                  message="Hello, I would like to visit your office or speak with an agent. When is a good time?"
                  label="WhatsApp Us"
                  className="w-full"
                />
              </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Verified &amp; Trusted</h3>
              <p className="text-blue-50 text-sm mb-4">
                What every Meridian client can count on.
              </p>
              <div className="flex flex-col gap-2">
                {[
                  "Verified title documents",
                  "Transparent, all-in pricing",
                  "Honest local guidance",
                ].map((credential) => (
                  <div key={credential} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                    <span className="text-sm text-blue-100">{credential}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
