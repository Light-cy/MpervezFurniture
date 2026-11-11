import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import heroBed1 from "@/assets/hero/hero-bed-1.jpg";
import heroBed2 from "@/assets/hero/hero-bed-2.jpg";
import heroBed3 from "@/assets/hero/hero-bed-3.jpg";
import { CategoryTiles } from "@/components/CategoryTiles";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { ProductSlider } from "@/components/ProductSlider";
import { Reveal } from "@/components/Reveal";
import { ReviewsCoverflow } from "@/components/ReviewsCoverflow";
import { SectionHeading } from "@/components/SectionHeading";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
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
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  isPrimaryExternal?: boolean;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  imageAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "modern-bed-collection",
    title: "Modern Bed Collection",
    subtitle: "Simple, modern comfort for your bedroom",
    description:
      "Contemporary upholstered headboards and seasoned wood frames crafted with modern aesthetics. Factory direct rates with 5-year warranty.",
    primaryCtaText: "Explore Bed Sets",
    primaryCtaLink: "/products",
    secondaryCtaText: "Customize on WhatsApp",
    secondaryCtaLink: waLink(
      "Assalam-o-Alaikum, I want to inquire about your modern luxury bed sets.",
    ),
    image: heroBed1,
    imageAlt: "Modern luxury upholstered bed collection",
  },
  {
    id: "contemporary-bedroom-sets",
    title: "Luxury Bedroom Sets",
    subtitle: "Elegance crafted for peaceful living",
    description:
      "Minimalist lines, warm ambient textures, and 5-year warranty on solid internal framing at direct factory rates.",
    primaryCtaText: "Customize on WhatsApp",
    primaryCtaLink: waLink(
      "Assalam-o-Alaikum, I want to inquire about custom modern bedroom set designs.",
    ),
    isPrimaryExternal: true,
    secondaryCtaText: "View Catalogue",
    secondaryCtaLink: "/products",
    image: heroBed2,
    imageAlt: "Contemporary luxury modern bedroom interior with ambient lighting",
  },
  {
    id: "bespoke-modern-beds",
    title: "Bespoke Modern Beds",
    subtitle: "Tailored to your room dimensions & style",
    description:
      "Choose your exact room measurements, luxury velvet or linen headboard, and matching bedside tables.",
    primaryCtaText: "Chat on WhatsApp",
    primaryCtaLink: waLink("Assalam-o-Alaikum, I want to order a custom-sized modern bed."),
    isPrimaryExternal: true,
    secondaryCtaText: "Showroom Location",
    secondaryCtaLink: "/contact",
    image: heroBed3,
    imageAlt: "Modern minimalist luxury bedroom bed set",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current] ?? HERO_SLIDES[0]!;

  return (
    <section className="relative px-3 pt-3 pb-6 sm:px-6 sm:pt-4 sm:pb-8 lg:px-8 xl:px-10">
      <div className="relative mx-auto flex min-h-[440px] w-full max-w-[1536px] items-center overflow-hidden rounded-2xl border border-border/80 shadow-2xl sm:min-h-[520px] sm:rounded-3xl md:min-h-[580px] lg:min-h-[640px]">
        {/* Background images with crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="h-full w-full object-cover object-center"
            />
            {/* Cinematic dark overlay on the left & bottom for crystal clear white typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlaid on Left (exact Lahore Furniture style) */}
        <div className="relative z-10 max-w-2xl px-6 py-12 text-left sm:px-12 md:px-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.08]">
                {slide.title}
              </h1>

              <p className="mt-3 text-base font-medium text-white/95 sm:text-xl">
                {slide.subtitle}
              </p>

              <p className="mt-2 hidden max-w-lg text-xs leading-relaxed text-white/75 sm:block sm:text-sm">
                {slide.description}
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
                {slide.isPrimaryExternal ? (
                  <a
                    href={slide.primaryCtaLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackWhatsAppClick({ source: "hero_banner" })}
                    className="btn-whatsapp inline-flex items-center gap-2"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    {slide.primaryCtaText}
                  </a>
                ) : (
                  <Link
                    to={slide.primaryCtaLink as "/" | "/products" | "/contact"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-cream shadow-xl transition-all hover:scale-105 hover:bg-white/95"
                  >
                    {slide.primaryCtaText}
                  </Link>
                )}

                {slide.secondaryCtaLink &&
                  (slide.secondaryCtaLink.startsWith("http") ? (
                    <a
                      href={slide.secondaryCtaLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-black/35 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/80"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      {slide.secondaryCtaText}
                    </a>
                  ) : (
                    <Link
                      to={slide.secondaryCtaLink as "/" | "/products" | "/contact"}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/50 bg-black/35 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/80"
                    >
                      {slide.secondaryCtaText}
                    </Link>
                  ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Lahore Furniture style bottom slide controls (< . . . >) */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 backdrop-blur-md sm:bottom-6">
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
            aria-label="Previous slide"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide: ${s.title}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next slide"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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
      <section className="mx-auto w-full max-w-[1536px] px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-10">
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
      <section className="mx-auto w-full max-w-[1536px] px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-10">
        <Reveal>
          <SectionHeading eyebrow="Browse the collection" title="Shop by Category" />
        </Reveal>
        <Reveal delay={0.1}>
          <CategoryTiles className="mt-8" />
        </Reveal>
      </section>

      {/* 5. Best Sellers — Luxury Product Slider (Zero Empty Gaps) */}
      <section className="mx-auto w-full max-w-[1536px] px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-10">
        <Reveal>
          <SectionHeading eyebrow="Customer favourites" title="Best Sellers" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <ProductSlider products={bestSellers} />
          </div>
        </Reveal>
      </section>

      {/* 6. All Products — Single Row Preview with See Full Collection CTA */}
      <section
        id="all-products"
        className="mx-auto w-full max-w-[1536px] scroll-mt-24 px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-10"
      >
        <Reveal>
          <SectionHeading eyebrow="The full collection" title="Hamari Tamam Products" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.slice(0, 5).map((p, idx) => (
              <div
                key={p.id}
                className={
                  idx === 2
                    ? "hidden md:block"
                    : idx === 3
                      ? "hidden lg:block"
                      : idx === 4
                        ? "hidden xl:block"
                        : "block"
                }
              >
                <ProductCard product={p} className="h-full" />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link
              to="/products"
              search={{}}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-night-card px-8 py-3.5 text-sm font-bold tracking-wide text-cream shadow-md transition-all duration-300 hover:scale-105 hover:border-gold hover:bg-gold hover:text-night"
            >
              <span>See Full Collection</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 7. Customer Reviews */}
      <section className="mx-auto w-full max-w-[1536px] px-4 pt-14 sm:px-6 sm:pt-20 lg:px-8 xl:px-10">
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
