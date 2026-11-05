import { MessageCircle, Eye, FileSearch, KeyRound } from "lucide-react";
import Section from "@/components/shared/Section";
import SectionHeader from "@/components/shared/SectionHeader";

/**
 * Process transparency as a conversion mechanism.
 *
 * The largest source of hesitation in a Nigerian property transaction is not
 * price — it is not knowing what happens next or when money changes hands.
 * Naming the four steps and, critically, stating at which step each fee is due
 * removes the ambiguity that otherwise causes a ready visitor to stall.
 *
 * The "when you pay" line is the load-bearing part of this section. It is also
 * the only place on the site where the fee sequence is stated end to end.
 */
const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Enquire",
    description:
      "Message the named agent on the listing. They confirm the property is still available and answer your questions directly.",
    payment: "No payment",
  },
  {
    icon: Eye,
    step: "02",
    title: "Inspect",
    description:
      "We arrange a viewing at a time that suits you — or a recorded video walkthrough if you are outside Nigeria.",
    payment: "No inspection fee",
  },
  {
    icon: FileSearch,
    step: "03",
    title: "Verify the title",
    description:
      "We share the title documents for your own lawyer to review. If anything fails verification, we withdraw the listing and tell you why.",
    payment: "Search fee — refunded if the title fails",
  },
  {
    icon: KeyRound,
    step: "04",
    title: "Complete",
    description:
      "Agreement signed, funds released (via escrow for diaspora buyers), keys handed over and documents registered in your name.",
    payment: "Agency and legal fees due here",
  },
];

export default function HowItWorks() {
  return (
    <Section className="bg-white">
      <SectionHeader
        eyebrow="How It Works"
        title="Four Steps, and You Know the Cost at Each One"
        description="No surprises, no fees appearing at the last minute. This is the whole process."
      />

      <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <li
            key={step.step}
            className="bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 w-11 h-11 rounded-lg flex items-center justify-center">
                <step.icon
                  className="w-5 h-5 text-blue-600"
                  aria-hidden="true"
                />
              </div>
              <span
                className="text-2xl font-bold text-slate-200"
                aria-hidden="true"
              >
                {step.step}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed flex-1">
              {step.description}
            </p>

            <p className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2 mt-4">
              {step.payment}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
