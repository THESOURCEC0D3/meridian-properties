import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OrganizationSchema from "@/components/shared/OrganizationSchema";
import { siteConfig, siteUrl } from "@/lib/config/site";

/**
 * Geist_Mono was loaded here and never used — no `font-mono` class exists
 * anywhere in the codebase. It was create-next-app scaffolding, and it cost a
 * preloaded woff2 request competing for bandwidth with the LCP hero image on
 * every cold visit. Removed.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  /**
   * metadataBase makes every relative OG/canonical URL resolve to an absolute
   * one. Without it, Next emits relative image paths that WhatsApp, Facebook and
   * X cannot fetch — which is why link previews rendered as bare grey links on
   * the site's single most important sharing channel.
   */
  metadataBase: new URL(siteUrl),

  /**
   * The template appends the brand automatically, so per-page metadata only has
   * to supply the distinctive part. Previously every page repeated
   * "— Meridian Properties NG" by hand.
   */
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "/",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e293b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          Listing images are served from images.unsplash.com, so the LCP hero
          cannot start downloading until a DNS lookup and TLS handshake to a
          third-party host complete — easily 300–600ms on a slow mobile
          connection before a single byte of the image arrives. preconnect starts
          that handshake immediately instead of waiting for the parser to reach
          the <img>.

          Self-hosting the images in /public would remove the round trip
          altogether and is the better long-term fix; this is the one-line
          version that helps today.
        */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        {/*
          .reveal starts at opacity 0 and needs JS to become visible. Without
          this, a visitor with JS disabled or a failed bundle would see blank
          sections below the hero.
        */}
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <OrganizationSchema />
        {/*
          Skip link — WCAG 2.4.1 (Bypass Blocks), Level A.
          Every page begins with the same navigation, so keyboard and screen
          reader users previously had to traverse it on every single page load.
          Visually hidden until focused, then pinned above the fixed navbar.
        */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="pt-nav">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
