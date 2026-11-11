import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import pfLogo from "@/assets/pf-logo.png";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-night/95 backdrop-blur-md">
      {settings.announcementEnabled && settings.announcementText && (
        <div className="border-b border-gold/25 bg-royal px-4 py-1.5 text-center text-[11px] font-medium text-on-maroon sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 shrink-0 text-on-maroon" />
            <span>{settings.announcementText}</span>
          </span>
        </div>
      )}
      <div className="mx-auto flex w-full max-w-[1536px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <img
            src={pfLogo}
            alt="Pervez Furniture logo"
            width={256}
            height={256}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-xl font-bold tracking-wide text-gold">
              PERVEZ
            </span>
            <span className="block text-xs font-bold tracking-[0.28em] text-cream sm:text-sm">
              FURNITURE
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 lg:gap-2.5 md:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "active" }}
              className="nav-link"
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
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
