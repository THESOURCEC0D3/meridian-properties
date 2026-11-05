import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig, whatsappLink } from "@/lib/config/site";

interface WhatsAppButtonProps {
  /** Defaults to the agency line so callers without a specific agent can omit it. */
  phone?: string;
  message: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function WhatsAppButton({
  phone,
  message,
  label = "WhatsApp Us",
  variant = "default",
  size = "default",
  className = "",
}: WhatsAppButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <a
        href={whatsappLink(message, phone ?? siteConfig.whatsapp)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
        {label}
        {/* External-target links need to announce that they leave the page;
            sighted users get the convention, screen reader users do not. */}
        <span className="sr-only"> (opens WhatsApp in a new tab)</span>
      </a>
    </Button>
  );
}
