"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Orientation is one of navigation's three jobs — where am I, where can I go,
   * how do I get back. This navbar answered only two: nothing indicated the
   * current page, visually or to a screen reader.
   *
   * Nested routes count as active on their section, so a property detail page
   * still highlights "Properties".
   */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const toggleRef = useRef<HTMLButtonElement>(null);

  /**
   * Escape closes the menu and returns focus to the toggle.
   *
   * An expandable panel that cannot be dismissed from the keyboard traps the
   * user: they have to tab through every item to get out. Returning focus to the
   * trigger matters just as much — without it focus lands back at the top of the
   * document and the user loses their place.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  /**
   * Locks body scroll while the menu is open, so the page behind it does not
   * scroll away under the user's thumb. The cleanup restores the previous value
   * rather than hardcoding "" — that way it composes with anything else that
   * might also be locking scroll.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  // Close on route change, otherwise the panel stays open over the new page.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-nav">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-md">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-none">
                Meridian Properties
              </p>
              <p className="text-xs text-slate-500 leading-none mt-0.5">
                Port Harcourt
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                  isActive(link.href)
                    ? "text-blue-700 underline decoration-2 underline-offset-8"
                    : "text-slate-700 hover:text-blue-700",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <WhatsAppButton
              phone="2340000000000"
              message="Hello, I would like to enquire about a property at Meridian Properties."
              label="WhatsApp Us"
              size="sm"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={toggleRef}
            type="button"
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-4 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "text-sm font-medium py-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                isActive(link.href)
                  ? "text-blue-700 font-semibold"
                  : "text-slate-700 hover:text-blue-700",
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <WhatsAppButton
            phone="2340000000000"
            message="Hello, I would like to enquire about a property at Meridian Properties."
            label="WhatsApp Us"
            size="sm"
          />
        </div>
      )}
    </nav>
  );
}
