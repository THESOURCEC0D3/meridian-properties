import { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us — Meridian Properties NG",
  description:
    "Get in touch with Meridian Properties NG. Talk to an agent about buying, renting, or investing in Port Harcourt real estate. CAC Registered. NIESV Affiliated.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
