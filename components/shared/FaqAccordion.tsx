import { ChevronDown } from "lucide-react";
import type { Faq } from "@/lib/data/faqs";

/**
 * Built on native <details>/<summary> rather than a state-driven accordion.
 *
 * The platform's disclosure element is keyboard-operable, screen-reader
 * announced, and expandable with JavaScript disabled — all for free. A
 * hand-rolled version would need "use client", useState, ARIA wiring, and key
 * handling to reach the same baseline, and would ship JavaScript to do it.
 * This stays a Server Component with zero client cost.
 */
export default function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-3">
      {items.map((faq) => (
        <details
          key={faq.question}
          className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex items-center justify-between gap-4 cursor-pointer p-5 font-medium text-slate-900 list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-xl">
            <span className="text-sm sm:text-base">{faq.question}</span>
            <ChevronDown
              className="w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="px-5 pb-5 -mt-1">
            <p className="text-sm text-slate-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
