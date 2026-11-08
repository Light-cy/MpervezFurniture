import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import pfLogo from "@/assets/pf-logo.png";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE, waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-16">
      {/* Gold line on top of the footer */}
      <div className="pf-hairline h-[2px] w-full" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img
              src={pfLogo}
              alt="Pervez Furniture logo"
              width={256}
              height={256}
              className="h-12 w-12 object-contain"
            />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-wide text-gold">
                PERVEZ
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.35em] text-cream-muted">
                FURNITURE
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-cream-muted">
            Luxury home furniture at factory rates, hand-crafted in Lahore. Order directly on
            WhatsApp with bespoke customization and 5 year warranty.
          </p>
          <SocialLinks className="mt-5" />
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-display text-lg font-semibold text-gold">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeProps={{ "aria-current": "page" }}
                  className="text-cream-muted transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-display text-lg font-semibold text-gold">Contact Us</h2>
          <ul className="mt-4 space-y-3 text-sm text-cream-muted">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 shrink-0 text-gold" />
              <a href={`tel:+${SITE.whatsappNumber}`} className="hover:text-gold">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4.5 w-4.5 shrink-0 text-gold" />
              <span>{SITE.hours}</span>
            </li>
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppClick({ source: "footer" })}
                className="inline-flex items-center gap-2 text-whatsapp hover:underline"
              >
                Chat with us on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-border/60 px-4 py-4 text-xs text-cream-muted sm:flex-row sm:justify-between">
        <span suppressHydrationWarning>© {year} Pervez Furniture. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-cream-muted/70 transition-colors hover:text-gold">
            Admin
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-medium text-gold transition-colors hover:text-gold-light"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
