import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

const BADGE_STYLES: Record<NonNullable<Product["badge"]>, string> = {
  HOT: "bg-royal text-cream",
  NEW: "bg-gold text-night",
  SALE: "bg-gold-light text-night",
};

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const [activeColourIndex, setActiveColourIndex] = useState(0);
  const currentColour = product.colours[activeColourIndex] ?? product.colours[0];
  const activeImage = currentColour?.image || product.images[0];
  const activeFilter = currentColour?.filter;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className={cn(
        "group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-night-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10",
        className,
      )}
    >
      <div>
        <div className="relative aspect-square overflow-hidden bg-night">
          <img
            src={activeImage}
            alt={`${product.name} in ${currentColour?.name ?? ""}`}
            loading="lazy"
            width={1024}
            height={1024}
            style={{ filter: activeFilter ?? "none" }}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span
              className={cn(
                "absolute top-3 left-3 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest",
                BADGE_STYLES[product.badge],
              )}
            >
              {product.badge}
            </span>
          )}
          {/* Quick active colour pill on image */}
          {currentColour && (
            <span className="absolute bottom-2.5 right-2.5 rounded-md bg-night/80 px-2 py-0.5 text-[10px] font-medium text-cream backdrop-blur-sm border border-border/60">
              {currentColour.name}
            </span>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-display line-clamp-2 text-base leading-snug sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-1 font-semibold text-gold">{formatPrice(product.price)}</p>

          {/* 4 Interactive Color Swatches */}
          {product.colours.length > 0 && (
            <div className="mt-3">
              <span className="text-[11px] text-cream-muted">Available Colours:</span>
              <div className="mt-1.5 flex items-center gap-1.5 sm:gap-2">
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
                      "h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-border shadow-sm transition-transform hover:scale-110",
                      idx === activeColourIndex
                        ? "ring-2 ring-gold ring-offset-2 ring-offset-night scale-110"
                        : "opacity-80 hover:opacity-100",
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 pt-0 sm:p-4 sm:pt-0">
        <span className="flex w-full items-center justify-center gap-1 rounded-full border border-gold/70 py-2 text-sm font-semibold text-gold transition-colors group-hover:bg-gold group-hover:text-night">
          View Details <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
