import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

/** Floating round WhatsApp button with a soft pulse, on every page. */
export function WhatsAppFab() {
  return (
    <a
      href={waLink("Assalam-o-Alaikum, I want to ask about your furniture.")}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackWhatsAppClick({ source: "floating_fab" })}
      aria-label="Chat with us on WhatsApp"
      className="pf-wa-pulse fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-50 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-on-maroon shadow-lg transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
