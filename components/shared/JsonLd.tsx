/**
 * Renders a JSON-LD structured-data block.
 *
 * The `</` → `<` escape is required, not cosmetic: without it a string in
 * the data containing "</script>" would terminate the tag early and inject
 * arbitrary markup into the page. Next's own JSON-LD guide specifies this.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
