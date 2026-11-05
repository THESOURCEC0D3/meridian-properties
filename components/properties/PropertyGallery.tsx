"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () =>
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );

  const goToNext = () =>
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );

  /**
   * Arrow keys move through the gallery.
   *
   * Photographs are the product on a property site, so a gallery drivable only
   * by mouse excludes keyboard users from the most important content on the
   * page. Handled on the wrapper so it works wherever focus sits inside it.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (images.length < 2) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      onKeyDown={handleKeyDown}
      role="group"
      aria-roledescription="carousel"
      aria-label={`Photos of ${title}`}
    >
      {/* Main Image */}
      <div className="relative h-72 md:h-96 w-full">
        <Image
          src={images[activeIndex]}
          alt={`${title} — photo ${activeIndex + 1} of ${images.length}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority
        />

        {/* These were icon-only buttons with no accessible name and no focus
            ring: a screen reader announced only "button", and a keyboard user
            could not see where they were. Padding raised to p-3 for a ~44px
            touch target. */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}

        {/* Announced politely so keyboard and screen reader users get feedback
            that the photo actually changed. */}
        <div
          className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full"
          aria-live="polite"
        >
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show photo ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex ? "true" : undefined}
              className={`relative h-16 w-24 shrink-0 rounded-md overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                index === activeIndex
                  ? "border-blue-600"
                  : "border-transparent hover:border-slate-400"
              }`}
            >
              {/* Empty alt: the button already carries the label, so describing
                  the image too would make screen readers announce it twice. */}
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
