"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "meridian:favourites";

function readFavourites(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    // Private browsing, disabled storage, or corrupt JSON. Favourites are a
    // convenience, so a failure here must never break the page.
    return [];
  }
}

/**
 * Saves a property for later, in localStorage.
 *
 * The site previously had no way to retain a visitor who was not ready today —
 * and in property, most visitors are months from transacting. Accounts would be
 * the heavyweight answer; localStorage gets most of the value for none of the
 * cost, with no signup friction and no personal data to hold.
 *
 * Renders unpressed on the server and syncs after mount: localStorage does not
 * exist during SSR, so reading it in the initial render state would produce a
 * hydration mismatch.
 */
export default function FavouriteButton({
  propertyId,
  propertyTitle,
  className,
}: {
  propertyId: string;
  propertyTitle: string;
  className?: string;
}) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsFavourite(readFavourites().includes(propertyId));
    setHydrated(true);
  }, [propertyId]);

  const toggle = () => {
    const current = readFavourites();
    const next = current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [...current, propertyId];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — keep the in-session state so the UI still responds.
    }
    setIsFavourite(next.includes(propertyId));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={hydrated ? isFavourite : undefined}
      aria-label={
        isFavourite
          ? `Remove ${propertyTitle} from saved properties`
          : `Save ${propertyTitle} for later`
      }
      className={cn(
        "inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isFavourite ? "fill-red-500 text-red-500" : "text-slate-600",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
