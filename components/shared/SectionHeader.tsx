import { cn } from "@/lib/utils";

/**
 * Eyebrow + heading + optional description.
 *
 * This exact three-part block appeared in eight section components with
 * hand-repeated typography. Extracting it guarantees every section header
 * shares one type scale and one colour, and makes a future change to that
 * treatment a single edit.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-12",
        centered && "text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p
          className={cn(
            "text-slate-600 leading-relaxed mt-4",
            centered && "max-w-2xl mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
