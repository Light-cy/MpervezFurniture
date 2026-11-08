import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Factory, MapPin, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import bedShahi from "@/assets/products/bed-shahi.jpg";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { SITE, absoluteUrl, waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Pervez Furniture Lahore" },
      {
        name: "description",
        content:
          "Discover Pervez Furniture — luxury hand-crafted furniture at factory rates in Lahore. Customization available, 5-year warranty, seasoned sheesham wood.",
      },
      { property: "og:title", content: "About Us | Pervez Furniture Lahore" },
      {
        property: "og:description",
        content:
          "Direct factory rates and bespoke furniture customization in Lahore. Visit our showroom in Margzar Scheme.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
});

const PILLARS = [
  {
    icon: Factory,
    title: "Direct Factory Rates",
    description:
      "By eliminating retail showroom middlemen and manufacturing directly in our own workshop, we pass true factory rates to our clients.",
  },
  {
    icon: Sparkles,
    title: "Complete Customization",
    description:
      "Whether you need custom dimensions to fit your bedroom layout or specific velvet fabrics and wood polishes, we craft to your exact specifications.",
  },
  {
    icon: ShieldCheck,
    title: "5 Years Solid Warranty",
    description:
      "We build exclusively using chemically-treated, seasoned sheesham wood and high-resilience foam, backed by our comprehensive 5-year warranty.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      {/* 1. Header */}
      <Reveal>
        <SectionHeading
          as="h1"
          eyebrow="Our Story & Craft"
          title="Pervez Furniture — Factory Rates & Royal Craft"
        />
      </Reveal>

      {/* 2. Intro story grid */}
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="space-y-4 text-cream-muted leading-relaxed">
            <p className="text-base sm:text-lg">
              Welcome to <strong className="text-cream">Pervez Furniture</strong>, Lahore's trusted
              destination for luxury bridal bedroom sets, hand-carved beds, royal drawing room
              sofas, and bespoke marble dining sets.
            </p>
            <p>
              Located at Margzar Scheme near Allama Iqbal Town, we combine traditional wood carving
              artistry with modern living comforts. Every piece is built to order using genuine
              seasoned sheesham wood, high-density foam, and premium imported upholstery.
            </p>
            <p>
              Unlike conventional multi-brand dealers, we operate our own production facility. This
              allows us to offer genuine <strong>factory rates</strong> and 100% bespoke{" "}
              <strong>customization</strong> for every client.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                <CheckCircle2 className="h-4 w-4" /> 5-Year Comprehensive Wood & Craft Warranty
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-night-card shadow-2xl">
            <img
              src={bedShahi}
              alt="Pervez Furniture royal hand-crafted craftsmanship"
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/70 to-transparent p-6">
              <p className="font-display text-lg font-bold text-cream">
                Hand-Carved Seasoned Sheesham
              </p>
              <p className="text-xs text-cream-muted">Crafted with care in Lahore, Pakistan</p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* 3. 3 Pillars */}
      <section className="mt-16 sm:mt-24">
        <Reveal>
          <SectionHeading eyebrow="Why Choose Us" title="Factory Direct Quality & Service" />
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-night-card p-6 transition-all hover:border-gold/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-night border border-gold/20 text-gold">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-cream">{p.title}</h3>
                <p className="mt-2 text-sm text-cream-muted leading-relaxed">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Showroom Visit & WhatsApp CTA */}
      <Reveal delay={0.2}>
        <div className="mt-16 rounded-3xl border border-gold/30 bg-gradient-to-br from-night-card via-night to-night-elevated p-8 text-center sm:p-12">
          <MapPin className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-cream">
            Visit Our Lahore Showroom
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-cream-muted">
            {SITE.address}
            <br />
            <span className="text-gold font-semibold">{SITE.hours}</span>
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={waLink("Assalam-o-Alaikum, I want to inquire about custom furniture designs.")}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackWhatsAppClick({ source: "about_page" })}
              className="btn-whatsapp inline-flex items-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Discuss on WhatsApp
            </a>
            <Link to="/products" className="btn-outline-gold">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
