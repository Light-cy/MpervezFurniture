import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "@/data/products";
import { CATEGORIES, formatOriginalPrice, formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

function FeaturedCard({ product }: { product: Product }) {
  const category = CATEGORIES.find((c) => c.id === product.category);
  const categoryLabel = category?.label ?? product.category;

  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group w-52 shrink-0 overflow-hidden rounded-2xl border border-border bg-night-card shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10 sm:w-64"
    >
      <div className="relative aspect-square overflow-hidden bg-night">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-3 sm:p-3.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">
          {categoryLabel}
        </span>
        <h3 className="mt-1 line-clamp-1 font-serif text-sm sm:text-base font-medium text-cream transition-colors group-hover:text-gold">
          {product.name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2 border-t border-border/40 pt-2">
          <span className="text-sm sm:text-base font-bold text-cream tracking-tight">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-cream-muted/75 line-through">
            {formatOriginalPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Horizontally auto-scrolling featured products carousel; loops endlessly, pauses on hover/touch. */
export function FeaturedCarousel({ products }: { products: Product[] }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={cn("pf-marquee-track flex w-max", paused && "pf-marquee-paused")}
        style={{ ["--marquee-duration" as string]: "28s" }}
        suppressHydrationWarning
      >
        <div className="flex gap-4 pr-4">
          {products.map((p) => (
            <FeaturedCard key={p.id} product={p} />
          ))}
        </div>
        <div className="flex gap-4 pr-4" aria-hidden="true">
          {products.map((p) => (
            <FeaturedCard key={`dup-${p.id}`} product={p} />
          ))}
        </div>
      </div>
      {/* Soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-night to-transparent" />
    </div>
  );
}
