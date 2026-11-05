import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config/site";
import { loadOgFont } from "@/lib/og/font";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/**
 * Site-wide social preview card.
 *
 * Generated rather than a checked-in binary so the copy stays in sync with
 * siteConfig and there is no image asset to maintain separately.
 *
 * Two constraints worth knowing about ImageResponse:
 *  - it renders through Satori, which supports a CSS subset — flexbox only (no
 *    grid), and `display` must be set explicitly on any multi-child element;
 *  - hierarchy here comes from size and colour rather than font weight, because
 *    only the regular weight is bundled. Asking for a weight with no matching
 *    font file makes Satori fetch one at build time (see lib/og/font.ts).
 */
export default async function OpengraphImage() {
  const fonts = await loadOgFont();

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
          padding: 72,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                background: "#ffffff",
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#ffffff", fontSize: 30 }}>
              {siteConfig.shortName}
            </span>
            <span style={{ color: "#94a3b8", fontSize: 20 }}>
              {siteConfig.locality}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              color: "#60a5fa",
              fontSize: 24,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            VERIFIED TITLES · TRANSPARENT PRICING
          </span>
          <span style={{ color: "#ffffff", fontSize: 66, lineHeight: 1.15 }}>
            Property in Port Harcourt,
          </span>
          <span style={{ color: "#60a5fa", fontSize: 66, lineHeight: 1.15 }}>
            without the guesswork.
          </span>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {["312 properties sold & let", "Since 2016", "100% verified title"].map(
            (item) => (
              <span key={item} style={{ color: "#cbd5e1", fontSize: 22 }}>
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
