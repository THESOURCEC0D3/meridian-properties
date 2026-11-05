import Link from "next/link";
import Section from "@/components/shared/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import FaqAccordion from "@/components/shared/FaqAccordion";
import JsonLd from "@/components/shared/JsonLd";
import { faqs } from "@/lib/data/faqs";

/**
 * FAQPage structured data, generated from the same `faqs` array the accordion
 * renders. One source, two consumers — the answers can never drift from the
 * markup, which is the usual failure mode when schema is hand-authored.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

/**
 * Positioned immediately before the closing CTA.
 *
 * Objections are what stop a convinced visitor from acting, so they need
 * answering after the argument has been made and before the ask — not buried on
 * a separate page the hesitant visitor will never click through to.
 */
export default function FaqSection() {
  return (
    <Section className="bg-slate-50">
      <JsonLd data={faqSchema} />
      <SectionHeader
        eyebrow="Before You Ask"
        title="Questions We Get Every Week"
        description="The things buyers and tenants in Port Harcourt are right to ask — answered plainly, including the parts that cost us business."
      />

      <FaqAccordion items={faqs} />

      <p className="text-center text-sm text-slate-600 mt-8">
        Still unsure about something?{" "}
        <Link
          href="/contact"
          className="text-blue-600 font-medium hover:underline"
        >
          Ask us directly
        </Link>
        .
      </p>
    </Section>
  );
}
