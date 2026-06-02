import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

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
                <MapPin className="w-5 h-5 text-white" />
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
              phone="2340000000000"
              message="Hello, I would like to enquire about a property at Meridian Properties."
              label="Chat With Us"
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
                <span className="text-slate-400 text-sm leading-relaxed">
                  14 Tombia Street, GRA Phase 2,
                  Port Harcourt, Rivers State
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="tel:+2340000000000"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  0800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href="https://wa.me/2340000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  WhatsApp: 0800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="mailto:info@meridianpropertiesng.com"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  info@meridianpropertiesng.com
                </a>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-xs text-slate-500 mb-2">Verified &amp; Trusted</p>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-400">
                  Verified title documents
                </span>
                <span className="text-xs text-slate-400">
                  Transparent, all-in pricing
                </span>
                <span className="text-xs text-slate-400">
                  Honest local guidance
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} Meridian Properties NG. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            14 Tombia Street, GRA Phase 2, Port Harcourt, Rivers State
          </p>
        </div>
      </div>

    </footer>
  );
}