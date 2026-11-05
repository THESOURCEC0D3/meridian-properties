import { Phone, MessageCircle } from "lucide-react";
import { formatPrice, type Agent, type Property } from "@/lib/data/properties";
import { siteConfig, whatsappLink } from "@/lib/config/site";

/**
 * Persistent mobile action bar for the property detail page.
 *
 * Even after fixing the grid order so price and CTA appear directly under the
 * gallery, a visitor who scrolls through the description, the feature grid, the
 * map and the similar listings has no call to action in view. On a market that
 * is overwhelmingly mobile, that is the single most expensive gap on the page.
 *
 * A Server Component: it renders two links, and links need no JavaScript.
 * Hidden at `lg` where the sticky sidebar already keeps the CTA on screen.
 */
export default function MobileCtaBar({
  property,
  agent,
}: {
  property: Property;
  agent?: Agent;
}) {
  const phone = agent?.phone ?? siteConfig.whatsapp;
  const message = `Hello ${agent?.name.split(" ")[0] ?? "Meridian Properties"}, I am interested in ${property.title} at ${property.location}. Please send more details.`;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-slate-900 truncate">
            {formatPrice(property.price, property.type)}
          </p>
          <p className="text-xs text-slate-600 truncate">
            {agent?.name ?? siteConfig.shortName}
          </p>
        </div>

        <a
          href={`tel:+${phone}`}
          aria-label={`Call ${agent?.name ?? "Meridian Properties"}`}
          className="shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <Phone className="w-5 h-5" aria-hidden="true" />
        </a>

        <a
          href={whatsappLink(message, phone)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center gap-2 h-12 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Enquire
          <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
