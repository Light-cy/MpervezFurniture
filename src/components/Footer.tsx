import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import pfLogoLight from "@/assets/pf-logo-light.png";
import { SocialLinks } from "@/components/SocialLinks";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
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
    <footer className="relative mt-16 bg-maroon text-on-maroon">
      {/* Gold line on top of the footer */}
      <div className="pf-hairline h-[2px] w-full" />

      <div className="mx-auto grid w-full max-w-[1536px] gap-10 px-4 py-10 sm:px-6 lg:px-8 xl:px-10 md:grid-cols-3">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img
              src={pfLogoLight}
              alt="Pervez Furniture logo"
              width={256}
              height={256}
              className="h-12 w-12 object-contain"
            />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold tracking-wide text-on-maroon">
                PERVEZ
              </span>
              <span className="block text-xs font-bold tracking-[0.28em] text-on-maroon-muted sm:text-sm">
                FURNITURE
              </span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-on-maroon-muted">
            Luxury home furniture at factory rates, hand-crafted in Lahore. Order directly on
            WhatsApp with bespoke customization and 5 year warranty.
          </p>
          <SocialLinks className="mt-5 [&_a]:border-on-maroon/35 [&_a]:text-on-maroon [&_a:hover]:bg-on-maroon [&_a:hover]:text-maroon" />
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-display text-lg font-semibold text-on-maroon">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeProps={{ "aria-current": "page" }}
                  className="text-on-maroon-muted transition-colors hover:text-on-maroon"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-display text-lg font-semibold text-on-maroon">Contact Us</h2>
          <ul className="mt-4 space-y-3 text-sm text-on-maroon-muted">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-on-maroon" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 shrink-0 text-on-maroon" />
              <a href={`tel:+${SITE.whatsappNumber}`} className="hover:text-on-maroon">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4.5 w-4.5 shrink-0 text-on-maroon" />
              <span>{SITE.hours}</span>
            </li>
            <li>
              <a
                href={waLink()}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackWhatsAppClick({ source: "footer" })}
                className="inline-flex items-center gap-2 font-medium text-on-maroon hover:underline"
              >
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
                Chat with us on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-on-maroon/15 bg-maroon-card/60 px-4 py-4 text-xs text-on-maroon-muted sm:px-6 lg:px-8 xl:px-10">
        <div className="mx-auto flex w-full max-w-[1536px] flex-col items-center justify-between gap-2 sm:flex-row">
          <span suppressHydrationWarning>© {year} Pervez Furniture. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="text-on-maroon-muted/80 transition-colors hover:text-on-maroon"
            >
              Admin
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-medium text-on-maroon transition-colors hover:text-on-maroon-muted"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
