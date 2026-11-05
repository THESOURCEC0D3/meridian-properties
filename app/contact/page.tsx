import { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import Reveal from "@/components/shared/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Meridian Properties NG. Talk to an agent about buying, renting, or investing in Port Harcourt real estate.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Meridian Properties NG",
    description:
      "Talk to a named agent about buying, renting, or investing in Port Harcourt property. WhatsApp replies within 30 minutes in office hours.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHero />
      <div className="bg-slate-50 py-16">
        <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
