import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "@/data/products";
import { CATEGORIES, formatOriginalPrice, formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  HOT: "bg-royal text-on-maroon",
  NEW: "bg-gold text-on-maroon",
  SALE: "bg-gold-light text-on-maroon",
};

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const [activeColourIndex, setActiveColourIndex] = useState(0);
  const currentColour = product.colours[activeColourIndex] ?? product.colours[0];
  const activeImage = currentColour?.image || product.images[0];
  const activeFilter = currentColour?.filter;
  const category = CATEGORIES.find((c) => c.id === product.category);
  const categoryLabel = category?.label ?? product.category;
  const originalPrice = product.originalPrice ?? Math.round((product.price * 1.55) / 500) * 500;
  const hasDiscount = originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className={cn(
        "group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-night-card shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10",
        className,
      )}
    >
      <div>
        {/* Product Image Stage */}
        <div className="relative aspect-square overflow-hidden bg-night">
          <img
            src={activeImage}
            alt={`${product.name} in ${currentColour?.name ?? ""}`}
            loading="lazy"
            width={1024}
            height={1024}
            style={{ filter: activeFilter ?? "none" }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm",
                BADGE_STYLES[product.badge],
              )}
            >
              {product.badge}
            </span>
          )}
          {/* Active finish indicator pill */}
          {currentColour && (
            <span className="absolute bottom-2.5 right-2.5 rounded-full bg-night/85 px-2.5 py-0.5 text-[10px] font-medium text-cream backdrop-blur-sm border border-border/60 shadow-xs">
              {currentColour.name}
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-4.5">
          {/* Eyebrow: Category & Savings Tag */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
              {categoryLabel}
            </span>
            {discountPercent > 0 && (
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gold border border-gold/25">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="mt-1.5 line-clamp-2 font-serif text-[15px] sm:text-base md:text-[17px] font-medium leading-snug tracking-tight text-cream transition-colors duration-200 group-hover:text-gold min-h-[2.5rem] sm:min-h-[2.75rem]">
            {product.name}
          </h3>

          {/* Price Presentation */}
          <div className="mt-2.5 flex items-baseline gap-2.5 border-t border-border/40 pt-2.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-cream">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-cream-muted/75 line-through font-normal">
                {formatOriginalPrice(product.price, originalPrice)}
              </span>
            )}
          </div>

          {/* Finishes Swatches */}
          {product.colours.length > 0 && (
            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-border/30">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cream-muted">
                Finishes
              </span>
              <div className="flex items-center gap-1.5">
                {product.colours.map((c, idx) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColourIndex(idx);
                    }}
                    title={c.name}
                    aria-label={`Select ${c.name}`}
                    aria-pressed={idx === activeColourIndex}
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full border border-border/90 shadow-xs transition-transform duration-200 hover:scale-120",
                      idx === activeColourIndex
                        ? "ring-2 ring-gold ring-offset-2 ring-offset-night-card scale-110"
                        : "opacity-80 hover:opacity-100",
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Action */}
      <div className="p-3.5 pt-0 sm:p-4.5 sm:pt-0">
        <span className="flex w-full items-center justify-center gap-1.5 rounded-full border border-gold/60 bg-gold/5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wide text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-night group-hover:border-gold group-hover:shadow-md group-hover:shadow-gold/20">
          View Details{" "}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
