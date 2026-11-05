import Link from "next/link";
import {
  Home,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { formattedAddress, siteConfig } from "@/lib/config/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const propertyTypes = [
  { label: "Properties For Sale", href: "/properties?type=sale" },
  { label: "Properties To Let", href: "/properties?type=let" },
  { label: "Short-Let Apartments", href: "/properties?type=shortlet" },
  { label: "Commercial Properties", href: "/properties?area=trans-amadi" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-md">
                {/* Same mark as the navbar — brand recognition depends on the
                    logo being identical in every position, not merely similar. */}
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">
                  Meridian Properties
                </p>
                <p className="text-xs text-slate-400 leading-none mt-0.5">
                  Port Harcourt
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Port Harcourt&apos;s trusted property agency. We connect buyers,
              tenants, and investors with verified properties across Rivers State.
            </p>
            <WhatsAppButton
              phone={siteConfig.whatsapp}
              message="Hello, I would like to enquire about a property at Meridian Properties."
              label="WhatsApp Us"
              size="sm"
            />
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Property Types */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Properties
            </h3>
            <ul className="flex flex-col gap-3">
              {propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm leading-relaxed">
                  {formattedAddress}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.phoneE164}`}
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  WhatsApp: {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            {/* Registration and professional body membership. These replaced
                three self-asserted claims ("Verified title documents",
                "Transparent, all-in pricing", "Honest local guidance") that
                repeated the positioning without evidencing it. A CAC number and
                an NIESV membership are checkable; adjectives are not. */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
                Registered &amp; Regulated
              </p>
              <ul className="flex flex-col gap-1.5">
                <li className="text-xs text-slate-300 flex items-start gap-1.5">
                  <BadgeCheck
                    className="w-3.5 h-3.5 text-green-400 shrink-0 mt-px"
                    aria-hidden="true"
                  />
                  CAC {siteConfig.credentials.rcNumber}
                </li>
                <li className="text-xs text-slate-300 flex items-start gap-1.5">
                  <BadgeCheck
                    className="w-3.5 h-3.5 text-green-400 shrink-0 mt-px"
                    aria-hidden="true"
                  />
                  {siteConfig.credentials.niesv}
                </li>
                <li className="text-xs text-slate-300 flex items-start gap-1.5">
                  <BadgeCheck
                    className="w-3.5 h-3.5 text-green-400 shrink-0 mt-px"
                    aria-hidden="true"
                  />
                  {siteConfig.credentials.esvarbon}
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">{formattedAddress}</p>
        </div>
      </div>

    </footer>
  );
}