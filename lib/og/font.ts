import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Loads the brand font for OG image generation from disk.
 *
 * This is not optional polish. `ImageResponse` renders through Satori, which
 * needs real font data — and if a weight is not supplied it tries to fetch one
 * over the network at build time. That turns every deploy into a build that can
 * fail on a network blip, and fails outright in any sandboxed or offline CI.
 *
 * Supplying the font from `assets/` makes OG generation fully self-contained and
 * deterministic. Geist is already the site's typeface, so the social cards match
 * the site rather than falling back to a generic sans.
 *
 * Only the regular weight is shipped; the cards use size and colour for
 * hierarchy instead of weight, so no second file is needed. Requesting a weight
 * with no matching font file is what triggers the network fetch.
 */
export async function loadOgFont() {
  const data = await readFile(join(process.cwd(), "assets/Geist-Regular.ttf"));

  return [
    {
      name: "Geist",
      data,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}
