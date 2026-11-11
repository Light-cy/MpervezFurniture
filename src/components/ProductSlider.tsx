import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

interface ProductSliderProps {
  products: Product[];
}

export function ProductSlider({ products }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [products]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by roughly 2 cards on mobile/tablet or 3 cards on desktop
    const card = el.firstElementChild as HTMLElement | null;
    const cardWidth = card ? card.offsetWidth : el.clientWidth / 4;
    const scrollAmount = (cardWidth + 16) * (direction === "left" ? -2 : 2);
    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="group/slider relative">
      {/* Navigation Controls on top-right on desktop */}
      <div className="mb-4 flex items-center justify-end gap-2 pr-1">
        <button
          type="button"
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous products"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-night-card text-cream shadow-sm transition-all duration-200 hover:border-gold hover:bg-night-elevated hover:text-gold disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Next products"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-night-card text-cream shadow-sm transition-all duration-200 hover:border-gold hover:bg-night-elevated hover:text-gold disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Floating Arrows on sides for effortless desktop browsing */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        aria-label="Previous products"
        className="absolute -left-4 top-[55%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-night-card/95 text-cream shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-gold hover:bg-night-elevated hover:text-gold disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        aria-label="Next products"
        className="absolute -right-4 top-[55%] z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-night-card/95 text-cream shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-gold hover:bg-night-elevated hover:text-gold disabled:pointer-events-none disabled:opacity-0 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Responsive Horizontal Scroll Track (Always 100% full with zero blank slots) */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pt-1 pb-4 sm:gap-4 md:gap-5"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[calc(68%-8px)] shrink-0 snap-start sm:w-[calc(45%-12px)] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] xl:w-[calc(20%-16px)]"
          >
            <ProductCard product={p} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
