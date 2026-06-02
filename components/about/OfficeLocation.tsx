import { MapPin, Phone, Mail, Clock } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const officeDetails = [
  {
    icon: MapPin,
    label: "Office Address",
    value: "14 Tombia Street, GRA Phase 2, Port Harcourt, Rivers State",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "0800 000 0000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@meridianpropertiesng.com",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-80 lg:h-full min-h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.4823!2d7.0134!3d4.8296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDknNDYuNiJOIDfCsDAwJzQ4LjIiRQ!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Meridian Properties Office Location"
            />
          </div>

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
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">
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
                  label="WhatsApp Our Office"
                  className="w-full"
                />
              </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Verified &amp; Trusted</h3>
              <p className="text-blue-200 text-sm mb-4">
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
      </div>
    </section>
  );
}
