import { Link } from "@tanstack/react-router";
import { Home, Info, Star, Store } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

const TABS = [
  { label: "Home", to: "/", icon: Home },
  { label: "About", to: "/about", icon: Info },
  { label: "Products", to: "/products", icon: Store },
  { label: "Reviews", to: "/reviews", icon: Star },
] as const;

/** Fixed bottom tab bar — mobile only. */
export function MobileTabBar() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/15 bg-night/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Mobile"
    >
      <div className="grid grid-cols-5">
        {TABS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            activeProps={{ "aria-current": "page" }}
            className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-cream-muted [&[data-status='active']]:text-gold"
          >
            <t.icon className="h-4.5 w-4.5" />
            {t.label}
          </Link>
        ))}
        <a
          href={waLink()}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsAppClick({ source: "mobile_tab" })}
          className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-cream-muted"
        >
          <WhatsAppIcon className="h-4.5 w-4.5 text-whatsapp" />
          WhatsApp
        </a>
      </div>
    </nav>
  );
}
