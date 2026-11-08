import { Link } from "@tanstack/react-router";
import { MessageCircle, Sparkles } from "lucide-react";
import pfLogo from "@/assets/pf-logo.png";
import { waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useShowroomSettings } from "@/lib/store-client";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
] as const;

export function Navbar() {
  const { data: settings } = useShowroomSettings();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-night/90 backdrop-blur-md">
      {settings.announcementEnabled && settings.announcementText && (
        <div className="border-b border-gold/20 bg-night-elevated/90 px-4 py-1.5 text-center text-[11px] font-medium text-cream sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 shrink-0 text-gold" />
            <span>{settings.announcementText}</span>
          </span>
        </div>
      )}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={pfLogo}
            alt="Pervez Furniture logo"
            width={256}
            height={256}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-lg font-bold tracking-wide text-gold">
              PERVEZ
            </span>
            <span className="block text-[10px] font-semibold tracking-[0.35em] text-cream-muted">
              FURNITURE
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ "aria-current": "page" }}
              className="nav-link text-cream-muted transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <a
          href={waLink("Assalam-o-Alaikum, I want to ask about your furniture.")}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick({ source: "navbar" })}
          className="btn-whatsapp hidden px-4 py-2 text-sm md:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
