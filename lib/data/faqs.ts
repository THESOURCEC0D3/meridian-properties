/**
 * Objection handling.
 *
 * The site had no FAQ, so the questions that actually stop a Port Harcourt
 * property buyer went unanswered: do I pay to inspect, what do the title types
 * mean, what happens if the title fails, can I buy from abroad, and how do I
 * know this agency is real.
 *
 * The title-type answers also close the education gap identified in the audit:
 * the site displays "C of O" and "Deed of Assignment" as its headline
 * differentiator without ever explaining what they mean — which makes the badge
 * decoration rather than transparency for anyone who does not already know.
 *
 * Kept as data (not JSX) so the same source feeds both the rendered accordion
 * and the FAQPage structured data in the homepage JSON-LD.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Do I have to pay an inspection fee before viewing a property?",
    answer:
      "No. We do not charge inspection fees before a property is confirmed available and its title verified. If an agent asks you for money simply to open a gate, that is a warning sign — walk away.",
  },
  {
    question: "What does the title type on each listing actually mean?",
    answer:
      "A Certificate of Occupancy (C of O) is a direct grant from the state government and the strongest title you can hold. Governor's Consent is the government's approval of a transfer from a previous C of O holder — equally secure when properly perfected. A Deed of Assignment records a transfer between private parties; it is valid but should be perfected with Governor's Consent to be fully secure. A Deed of Conveyance is an older transfer instrument, common on long-held family land. We show the exact instrument on every listing so you can judge the risk yourself instead of taking our word for it.",
  },
  {
    question: "What will I actually pay on top of the rent or purchase price?",
    answer:
      "For rentals, the full move-in cost is published on every listing: annual rent, 10% agency fee, 10% legal fee, and the caution deposit, with the total shown. For purchases, expect roughly 5% agency commission plus legal and perfection fees, which we quote in writing before you commit. There are no other charges from us at any stage.",
  },
  {
    question: "What happens if the title does not check out?",
    answer:
      "We withdraw the listing and tell you. It has cost us mandates and it will happen again. If you have already paid an inspection or search fee on a property we then withdraw, we refund it in full.",
  },
  {
    question: "Can I buy from the UK, US or Canada without flying to Nigeria?",
    answer:
      "Yes. We run a video walkthrough on a call at a time that suits your timezone, send scanned title documents for your own lawyer to review, and hold your funds with an independent escrow agent until the deed is signed and registered in your name. We will also act on instructions from a lawyer or family member you nominate.",
  },
  {
    question: "How do I know Meridian Properties is a legitimate agency?",
    answer:
      "We are registered with the Corporate Affairs Commission (RC 1482093), our agents are NIESV members and ESVARBON registered, and we have a physical office at 14 Tombia Street, GRA Phase 2 that you are welcome to walk into during office hours. Every agent on this site is a named individual with their own direct line.",
  },
  {
    question: "How quickly will someone respond to my enquiry?",
    answer:
      "WhatsApp enquiries are answered within 30 minutes during office hours (Mon–Fri 8am–6pm, Sat 9am–4pm). Calls are answered immediately. Email within 4 hours. Anything after hours is answered by 9am the next working day.",
  },
];
