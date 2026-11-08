import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import bedRosewood from "@/assets/products/bed-rosewood.jpg";
import bedShahi from "@/assets/products/bed-shahi.jpg";
import { CategoryTiles } from "@/components/CategoryTiles";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ReviewsCoverflow } from "@/components/ReviewsCoverflow";
import { SectionHeading } from "@/components/SectionHeading";
import { absoluteUrl, waLink } from "@/config/site";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useCatalogueProducts, useCustomerReviews } from "@/lib/store-client";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Pervez Furniture | Factory Rates & Custom Furniture in Lahore" },
      {
        name: "description",
        content:
          "Shop luxury furniture at factory rates in Lahore. Customization available, 5 year warranty — order directly on WhatsApp.",
      },
      {
        property: "og:title",
        content: "Pervez Furniture | Factory Rates & Custom Furniture Available",
      },
      {
        property: "og:description",
        content:
          "Shop luxury hand-crafted beds, bedroom sets, sofas and dining sets in Lahore. Order on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
});

interface HeroSlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  isPrimaryExternal?: boolean;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  image: string;
  imageAlt: string;
  imageTag: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "factory-rates",
    badge: "DIRECT FROM FACTORY",
    title: "Factory Rates Furniture Available",
    description:
      "Direct factory pricing on royal bridal bedroom sets, luxury carved beds and drawing room furniture. Built with pure seasoned sheesham wood and backed by a 5-year warranty.",
    primaryCtaText: "Explore Bed Sets",
    primaryCtaLink: "/products",
    secondaryCtaText: "Contact Showroom",
    secondaryCtaLink: "/contact",
    image: bedShahi,
    imageAlt: "Shahi Hand-Carved Royal Bed Set",
    imageTag: "Direct Factory Pricing · 5 Year Warranty",
  },
  {
    id: "customization",
    badge: "CUSTOM SIZES & FABRICS",
    title: "Customization of Furniture Available",
    description:
      "Get bespoke furniture crafted to your exact room measurements, polish tones, and luxury fabric selections. Hand-crafted by master artisans with 5-year warranty.",
    primaryCtaText: "Customize on WhatsApp",
    primaryCtaLink: waLink(
      "Assalam-o-Alaikum, I want to inquire about custom furniture designs and pricing.",
    ),
    isPrimaryExternal: true,
    secondaryCtaText: "View Catalogue",
    secondaryCtaLink: "/products",
    image: bedRosewood,
    imageAlt: "Noor Mahal Carved Bed Set Customization",
    imageTag: "100% Bespoke Designs · Factory Crafted",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current] ?? HERO_SLIDES[0]!;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-night-card/70 via-night to-night py-8 sm:py-16">
      {/* Subtle clean background glows */}
      <div className="pointer-events-none absolute -top-24 -left-32 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-royal/15 blur-[120px]" />

      <div className="mx-auto max-w-6xl px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            {/* Slide Content */}
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-gold">
                <Sparkles className="h-3.5 w-3.5" />
                {slide.badge}
              </span>
              <h1 className="gold-shimmer-text mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base text-cream-muted md:mx-0 sm:text-lg">
                {slide.description}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                {slide.isPrimaryExternal ? (
                  <a
                    href={slide.primaryCtaLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "hero_banner" })}
                    className="btn-whatsapp inline-flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {slide.primaryCtaText}
                  </a>
                ) : (
                  <Link
                    to={slide.primaryCtaLink as "/" | "/products" | "/contact"}
                    className="btn-gold"
                  >
                    {slide.primaryCtaText}
                  </Link>
                )}

                <Link
                  to={slide.secondaryCtaLink as "/" | "/products" | "/contact"}
                  className="btn-outline-gold"
                >
                  {slide.secondaryCtaText}
                </Link>
              </div>

              {/* Guarantees */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-cream-muted md:justify-start">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-gold" />5 Years Warranty
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  Pure Seasoned Sheesham
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                  Lahore Showroom Visit
                </span>
              </div>
            </div>

            {/* Slide Bed Set Image */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-gold/30 bg-night-card shadow-2xl shadow-gold/10">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  width={1024}
                  height={1024}
                  className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night via-night/60 to-transparent p-5">
                  <span className="inline-block rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
                    {slide.imageTag}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Bar */}
        <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide: ${s.title}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === current ? "w-8 bg-gold" : "w-2.5 bg-border hover:bg-gold/50"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-night-card text-cream-muted transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-night-card text-cream-muted transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { data: products } = useCatalogueProducts();
  const { reviews } = useCustomerReviews();
  const bestSellers = products.filter((p) => p.bestSeller);

  return (
    <div>
      {/* 1. Hero Carousel (Factory Rates & Customization with Bed Sets) */}
      <HeroCarousel />

      {/* 2. Red marquee strip */}
      <Marquee />

      {/* 3. Featured Products */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="Hand-picked" title="Featured Products" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <FeaturedCarousel products={products} />
          </div>
        </Reveal>
      </section>

      {/* 4. Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="Browse the collection" title="Shop by Category" />
        </Reveal>
        <Reveal delay={0.1}>
          <CategoryTiles className="mt-8" />
        </Reveal>
      </section>

      {/* 5. Best Sellers — responsive 4-column desktop grid */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="Customer favourites" title="Best Sellers" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 6. All Products — above reviews */}
      <section id="all-products" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="The full collection" title="Hamari Tamam Products" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 7. Customer Reviews */}
      <section className="mx-auto max-w-6xl px-4 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="What Lahore says" title="Customer Reviews" />
        </Reveal>
        <Reveal delay={0.1}>
          <ReviewsCoverflow reviews={reviews} className="mt-8" />
          <div className="mt-6 text-center">
            <Link
              to="/reviews"
              search={{}}
              className="inline-flex items-center gap-1.5 font-semibold text-gold hover:text-gold-light"
            >
              See all reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
