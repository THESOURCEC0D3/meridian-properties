/**
 * Address-driven Google Maps embed.
 *
 * Shared by the office section and every property page so there is one iframe
 * implementation rather than two. Built from an address string rather than
 * lat/long coordinates, so the pin always follows the address the page displays
 * and there are no magic coordinate literals to drift.
 *
 * The `q=…&output=embed` form needs no API key.
 */
export default function LocationMap({
  query,
  title,
  className = "",
  heightClassName = "h-72",
}: {
  /** Address or place name to resolve. */
  query: string;
  /** Accessible name for the iframe — required for screen readers. */
  title: string;
  className?: string;
  heightClassName?: string;
}) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&output=embed`;

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${heightClassName} ${className}`}
    >
      <iframe
        src={src}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
