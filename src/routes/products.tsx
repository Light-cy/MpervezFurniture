import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { absoluteUrl } from "@/config/site";
import { CATEGORIES } from "@/data/products";
import { useCatalogueProducts } from "@/lib/store-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => {
    const c = search["category"];
    return typeof c === "string" && c ? { category: c } : {};
  },
  component: ProductsPage,
  head: () => ({
    meta: [
      { title: "All Products | Pervez Furniture" },
      {
        name: "description",
        content:
          "Every product from Pervez Furniture — royal sofas, carved beds, marble dining sets and accent chairs. Order on WhatsApp.",
      },
      { property: "og:title", content: "All Products | Pervez Furniture" },
      {
        property: "og:description",
        content: "Every product from Pervez Furniture Lahore. Order on WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/products") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/products") }],
  }),
});

function ProductsPage() {
  const { category } = Route.useSearch();
  const { data: products } = useCatalogueProducts();
  const active = CATEGORIES.find((c) => c.id === category);
  const list = active ? products.filter((p) => p.category === active.id) : products;

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10">
      <Reveal>
        <SectionHeading
          as="h1"
          eyebrow={active ? "Collection" : "The full collection"}
          title={active ? active.label : "Hamari Tamam Products"}
        />
      </Reveal>

      {/* Refined Category Navigation Tabs (Architectural Square Corners & Responsive Alignment) */}
      <Reveal delay={0.1}>
        <div className="relative mt-8 sm:mt-10">
          {/* Subtle mobile edge fade hints */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-night to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-night to-transparent sm:hidden" />

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-1 py-1.5 sm:flex-wrap sm:justify-center sm:gap-2.5 sm:px-0">
            <Link
              to="/products"
              search={{}}
              aria-current={active ? undefined : "page"}
              className={cn(
                "shrink-0 rounded-md border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 sm:text-sm",
                !active
                  ? "border-gold bg-gold text-night font-semibold shadow-sm shadow-gold/25"
                  : "border-border/80 bg-night-card text-cream-muted hover:border-gold/60 hover:bg-night-elevated hover:text-gold",
              )}
            >
              All Products
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to="/products"
                search={{ category: c.id }}
                aria-current={active?.id === c.id ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md border px-4 py-2 text-xs font-medium tracking-wide transition-all duration-200 sm:text-sm",
                  active?.id === c.id
                    ? "border-gold bg-gold text-night font-semibold shadow-sm shadow-gold/25"
                    : "border-border/80 bg-night-card text-cream-muted hover:border-gold/60 hover:bg-night-elevated hover:text-gold",
                )}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Product count indicator */}
      <div className="mt-6 flex items-center justify-between border-b border-border/50 pb-3 text-xs text-cream-muted">
        <span>
          Showing <strong className="text-cream">{list.length}</strong> product
          {list.length === 1 ? "" : "s"}
        </span>
        {active && (
          <Link to="/products" search={{}} className="text-gold hover:underline">
            Clear filter
          </Link>
        )}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
