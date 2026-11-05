"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades and slides its content up the first time it scrolls into view.
 *
 * This is the only client JavaScript the animation system needs. The motion
 * itself is a CSS transition (`.reveal` in globals.css); this component's sole
 * job is to flip `data-revealed` once. Children stay server-rendered — passing
 * them through as a slot does not pull them into the client bundle.
 *
 * Reduced-motion users and no-JS visitors are handled in CSS, not here, so the
 * content is never stranded at opacity 0.
 */
export default function Reveal({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          // Reveal once. Re-hiding on scroll-up reads as a gimmick, not polish.
          observer.disconnect();
        }
      },
      // Trigger when the top edge passes 85% down the viewport. A rootMargin is
      // used instead of a threshold ratio because a tall section (the agent
      // profiles on mobile) can never be 10%+ visible on a short screen, and
      // would stay hidden forever.
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed={revealed || undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
