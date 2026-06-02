"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyDetailClientProps {
  propertyTitle: string;
}

export default function PropertyDetailClient({
  propertyTitle,
}: PropertyDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Mobile / supported browsers: open the native OS share sheet.
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: `Check out this property: ${propertyTitle}`,
          url,
        });
      } catch {
        // User dismissed the share sheet — nothing to do.
      }
      return;
    }

    // Desktop fallback: copy the link and confirm briefly.
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2 text-xs shrink-0"
    >
      <Share2 className="w-4 h-4" />
      {copied ? "Link Copied!" : "Share Property"}
    </Button>
  );
}
