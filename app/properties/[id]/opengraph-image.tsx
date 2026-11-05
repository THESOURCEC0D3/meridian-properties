import { ImageResponse } from "next/og";
import { getPropertyById, formatPrice } from "@/lib/data/properties";
import { siteConfig } from "@/lib/config/site";
import { loadOgFont } from "@/lib/og/font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Per-property social preview card — the highest-value SEO change on this site.
 *
 * The whole conversion strategy runs through WhatsApp, and the detail page has a
 * Share button. With no og:image, a shared property link rendered as a bare grey
 * rectangle: no price, no headline, no location. The share did none of the
 * selling it was built to do.
 *
 * This renders the three facts that drive the forward: price, what it is, where
 * it is. Deliberately text-only — embedding the listing photo would mean a
 * remote fetch during prerender for all twelve pages, turning a network blip
 * into a failed deploy. Adding the photo is safe once images are same-origin.
 */
export default async function PropertyOpengraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);
  const fonts = await loadOgFont();

  if (!property) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0f172a",
            color: "#ffffff",
            fontSize: 48,
            fontFamily: "Geist",
          }}
        >
          {siteConfig.name}
        </div>
      ),
      { ...size, fonts },
    );
  }

  const typeLabel =
    property.type === "sale"
      ? "For Sale"
      : property.type === "let"
        ? "To Let"
        : "Short Let";

  const specs = [
    property.bedrooms > 0 ? `${property.bedrooms} bed` : null,
    property.bathrooms > 0 ? `${property.bathrooms} bath` : null,
    `${property.size} sqm`,
  ].filter(Boolean) as string[];

  /**
   * Geist-Regular has no glyph for the Naira sign (U+20A6), so rendering it in
   * an OG card produces a "tofu" box in place of the currency — on the most
   * prominent number in the image. The ISO code reads correctly everywhere and
   * avoids shipping a second font file for one character.
   */
  const priceText = formatPrice(property.price, property.type).replace(
    "₦",
    "NGN ",
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 64,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: 28 }}>
            {siteConfig.shortName}
          </span>
          <span
            style={{
              background: "#2563eb",
              color: "#ffffff",
              fontSize: 22,
              padding: "10px 26px",
              borderRadius: 999,
            }}
          >
            {typeLabel}
          </span>
        </div>

        {/* Price leads — it is the first thing anyone opening a shared property
            link wants to know. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#ffffff",
              fontSize: 74,
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            {priceText}
          </span>
          <span
            style={{
              color: "#e2e8f0",
              fontSize: 38,
              lineHeight: 1.25,
              marginBottom: 16,
            }}
          >
            {property.title}
          </span>
          <span style={{ color: "#94a3b8", fontSize: 28 }}>
            {property.location}
          </span>
        </div>

        {/* Title type is omitted for short-lets, where a Certificate of
            Occupancy means nothing to a guest booking two nights. */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {specs.map((spec) => (
            <span key={spec} style={{ color: "#cbd5e1", fontSize: 24 }}>
              {spec}
            </span>
          ))}
          {property.type !== "shortlet" && (
            <span style={{ color: "#4ade80", fontSize: 24 }}>
              Title: {property.titleType}
            </span>
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
