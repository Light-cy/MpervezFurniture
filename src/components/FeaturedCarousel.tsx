import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { cn } from "@/lib/utils";

function FeaturedCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group w-52 shrink-0 overflow-hidden rounded-2xl border border-border bg-night-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10 sm:w-64"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-display line-clamp-1 text-sm sm:text-base">{product.name}</h3>
        <p className="mt-1 text-sm font-semibold text-gold">{formatPrice(product.price)}</p>
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
