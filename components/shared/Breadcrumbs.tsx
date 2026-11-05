import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "@/components/shared/JsonLd";
import { siteUrl } from "@/lib/config/site";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumbs showing position in the hierarchy.
 *
 * The detail page previously had only a "Back to Properties" link. That answers
 * "how do I go back one step"; breadcrumbs answer "where am I" — a different and
 * more useful question on a deep page.
 *
 * They also emit BreadcrumbList structured data, which is what makes Google
 * render a readable path in search results instead of a raw URL.
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb">
      <JsonLd data={schema} />
      <ol className="flex items-center gap-1.5 flex-wrap text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-slate-600 hover:text-blue-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                // aria-current marks the current page for screen readers, which
                // otherwise hear an undifferentiated list of place names.
                <span className="text-slate-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
