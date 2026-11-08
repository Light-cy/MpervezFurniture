import { Facebook, Instagram, Youtube } from "lucide-react";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.53.02C13.84 0 15.14.71 15.8 1.85c.44.75 1.19 1.29 2.05 1.42v2.09c-.8-.03-1.6-.28-2.28-.75-.34-.23-.64-.51-.9-.84v6.35c0 2.7-2.19 4.89-4.89 4.89-2.7 0-4.89-2.19-4.89-4.89 0-2.7 2.19-4.89 4.89-4.89.31 0 .61.03.9.09v2.55c-.17-.05-.35-.08-.53-.08-1.28 0-2.33 1.05-2.33 2.33 0 1.28 1.05 2.33 2.33 2.33 1.28 0 2.33-1.05 2.33-2.33V.02h2.33z" />
    </svg>
  );
}

/**
 * The single source of truth for the showroom's social accounts, so the navbar,
 * footer and contact page can never drift apart.
 */
const SOCIAL_LINKS = [
  { label: "Facebook", href: SITE.socials.facebook, Icon: Facebook },
  { label: "Instagram", href: SITE.socials.instagram, Icon: Instagram },
  { label: "TikTok", href: SITE.socials.tiktok, Icon: TikTokIcon },
  { label: "YouTube", href: SITE.socials.youtube, Icon: Youtube },
] as const;

export function SocialLinks({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div className={cn("flex gap-3", className)}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Pervez Furniture on ${label}`}
          className={cn(
            "grid place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-night",
            size === "md" ? "h-10 w-10" : "h-9 w-9",
          )}
        >
          <Icon className={size === "md" ? "h-4.5 w-4.5" : "h-4 w-4"} />
        </a>
      ))}
    </div>
  );
}
