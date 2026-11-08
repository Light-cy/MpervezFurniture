import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SocialLinks } from "@/components/SocialLinks";
import { SITE, absoluteUrl, waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us | Pervez Furniture" },
      {
        name: "description",
        content:
          "Visit Pervez Furniture in Margzar Scheme near Allama Iqbal Town, Lahore or order on WhatsApp. All days open, 12:00 PM to 10:00 PM.",
      },
      { property: "og:title", content: "Contact Us | Pervez Furniture" },
      {
        property: "og:description",
        content: "Visit our Lahore showroom or order directly on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Reveal>
        <SectionHeading as="h1" eyebrow="We're here for you" title="Contact Us" />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-night-card p-6">
            <MapPin className="h-6 w-6 text-gold" />
            <h2 className="font-display mt-3 text-lg font-semibold">Showroom</h2>
            <p className="mt-1 text-sm text-cream-muted">{SITE.address}</p>
          </div>
          <div className="rounded-2xl border border-border bg-night-card p-6">
            <Clock className="h-6 w-6 text-gold" />
            <h2 className="font-display mt-3 text-lg font-semibold">Opening Hours</h2>
            <p className="mt-1 text-sm text-cream-muted">{SITE.hours}</p>
          </div>
          <div className="rounded-2xl border border-border bg-night-card p-6">
            <Phone className="h-6 w-6 text-gold" />
            <h2 className="font-display mt-3 text-lg font-semibold">Call / WhatsApp</h2>
            <a
              href={`tel:+${SITE.whatsappNumber}`}
              className="mt-1 block text-sm text-cream-muted hover:text-gold"
            >
              {SITE.whatsappDisplay}
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-night-card p-6">
            <MessageCircle className="h-6 w-6 text-gold" />
            <h2 className="font-display mt-3 text-lg font-semibold">Follow Us</h2>
            <SocialLinks size="sm" className="mt-3" />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <a
            href={waLink("Assalam-o-Alaikum, I want to ask about your furniture.")}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsAppClick({ source: "contact_page" })}
            className="btn-whatsapp w-full py-4 text-base sm:text-lg"
          >
            <MessageCircle className="h-6 w-6" />
            Order on WhatsApp
          </a>
          <p className="mt-3 text-xs text-cream-muted">
            All orders are taken on WhatsApp — our team replies within minutes during opening hours.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
