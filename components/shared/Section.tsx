import { cn } from "@/lib/utils";
import Reveal from "@/components/shared/Reveal";

/**
 * The standard page section: vertical rhythm plus the centred content column.
 *
 * `py-16` + `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` was repeated verbatim in
 * 15+ files. Centralising it means section spacing is a one-file change, and
 * new sections cannot drift from the established rhythm.
 */
export default function Section({
  as: Tag = "section",
  className,
  innerClassName,
  children,
}: {
  as?: "section" | "div";
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    // The background stays put; only the content column rises. Animating the
    // whole <section> would slide its background colour too, opening a visible
    // gap against the section above while it moves.
    <Tag className={cn("py-16", className)}>
      <Reveal
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          innerClassName,
        )}
      >
        {children}
      </Reveal>
    </Tag>
  );
}
