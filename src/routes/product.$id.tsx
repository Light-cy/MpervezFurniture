import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, MessageCircle, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ReviewGridCard } from "@/components/ReviewGridCard";
import { ReviewModal } from "@/components/ReviewModal";
import { ReviewsCoverflow } from "@/components/ReviewsCoverflow";
import { ReviewSubmitModal } from "@/components/ReviewSubmitModal";
import { SectionHeading } from "@/components/SectionHeading";
import { Stars } from "@/components/Stars";
import { absoluteUrl, waLink } from "@/config/site";
import { formatPrice, getProduct, orderMessage, type ProductColour } from "@/data/products";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useCatalogueProducts, useCustomerReviews } from "@/lib/store-client";
import type { Review, ReviewItem } from "@/lib/store-types";
import { productSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/products" search={{}} className="btn-gold mt-6">
        Back to Products
      </Link>
    </div>
  ),
  head: ({ params }) => {
    const product = getProduct(params.id);
    const path = `/product/${params.id}`;
    return {
      meta: [
        {
          title: product ? `${product.name} | Pervez Furniture` : "Product | Pervez Furniture",
        },
        {
          name: "description",
          content: product
            ? `${product.description} 5 year warranty, factory direct rates. Order on WhatsApp.`
            : "Luxury furniture in Lahore — order on WhatsApp.",
        },
        {
          property: "og:title",
          content: product ? `${product.name} | Pervez Furniture` : "Product | Pervez Furniture",
        },
        {
          property: "og:description",
          content: product?.description ?? "Luxury furniture in Lahore.",
        },
        { property: "og:type", content: "product" },
        { property: "og:url", content: absoluteUrl(path) },
        {
          property: "og:image",
          content: absoluteUrl(product?.images[0] ?? "/og-image.jpg"),
        },
      ],
      links: [{ rel: "canonical", href: absoluteUrl(path) }],
      scripts: product
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(productSchema(product)),
            },
          ]
        : [],
    };
  },
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: allProducts } = useCatalogueProducts();
  const { reviews: allReviews, submitReview } = useCustomerReviews();

  const product = allProducts.find((p) => p.id === id) ?? getProduct(id);
  if (!product) throw notFound();

  const defaultColour: ProductColour = product.colours[0] ?? {
    name: "Classic",
    hex: "#C5A059",
    image: product.images[0] ?? "",
  };

  const [colour, setColour] = useState<ProductColour>(defaultColour);
  const [activeImage, setActiveImage] = useState<string>(
    defaultColour.image || product.images[0] || "",
  );
  const [selectedReview, setSelectedReview] = useState<(Review | ReviewItem) | null>(null);
  const [submitReviewOpen, setSubmitReviewOpen] = useState(false);
  const [showAllProductReviews, setShowAllProductReviews] = useState(false);

  const productSpecificReviews = allReviews.filter((r) => r.productId === product.id);
  const otherReviews = allReviews.filter((r) => r.productId !== product.id);
  const coverflowReviews = [...productSpecificReviews, ...otherReviews];
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleSelectColour = (newColour: ProductColour) => {
    setColour(newColour);
    setActiveImage(newColour.image || product.images[0] || "");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      {/* 1. Back link */}
      <Link
        to="/products"
        search={{}}
        className="inline-flex items-center gap-2 text-sm font-medium text-cream-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* 2. Gallery */}
        <div>
          <div className="pf-float overflow-hidden rounded-3xl border border-gold/20 bg-night-card">
            <img
              src={activeImage}
              alt={`${product.name} in ${colour.name}`}
              width={1024}
              height={1024}
              style={{ filter: colour.filter ?? "none" }}
              className="aspect-square w-full object-cover transition-all duration-300"
            />
          </div>

          {/* Image thumbnails */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImage(img)}
                aria-label={`Show image ${i + 1}`}
                aria-pressed={activeImage === img}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded-xl border transition-colors",
                  activeImage === img ? "border-gold" : "border-border hover:border-gold/50",
                )}
              >
                <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 3–6. Details */}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Stars rating={5} />
            <a
              href="#product-reviews-section"
              className="text-sm text-cream-muted hover:text-gold hover:underline"
            >
              {productSpecificReviews.length > 0
                ? `${productSpecificReviews.length} review${productSpecificReviews.length === 1 ? "" : "s"} for this product (${allReviews.length} total)`
                : `${allReviews.length} showroom customer reviews`}
            </a>
          </div>
          <p className="mt-4 text-3xl font-bold text-gold">{formatPrice(product.price)}</p>
          <p className="mt-4 text-cream-muted">{product.description}</p>

          {/* 4 Interactive Color Swatches with Active Name */}
          <div className="mt-6 rounded-2xl border border-border bg-night-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-cream">Selected Colour:</span>
              <span className="text-sm font-bold text-gold">{colour.name}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {product.colours.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleSelectColour(c)}
                  aria-label={`Colour: ${c.name}`}
                  aria-pressed={c.name === colour.name}
                  title={c.name}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all",
                    c.name === colour.name
                      ? "border-gold bg-gold/10 text-gold shadow-sm shadow-gold/20"
                      : "border-border text-cream-muted hover:border-gold/50 hover:text-cream",
                  )}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-border/80 shadow-inner"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                  {c.name === colour.name && <Check className="h-3.5 w-3.5 text-gold" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Specification table */}
          <dl className="mt-6 overflow-hidden rounded-2xl border border-border">
            {Object.entries(product.specs).map(([label, value], i) => (
              <div
                key={label}
                className={cn(
                  "grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]",
                  i > 0 && "border-t border-border",
                )}
              >
                <dt className="p-3 text-sm font-semibold text-gold">{label}</dt>
                <dd className="m-0 border-l border-border p-3 text-sm text-cream-muted">{value}</dd>
              </div>
            ))}
          </dl>

          {/* 6. Order on WhatsApp with Pre-filled selected colour */}
          <a
            href={waLink(orderMessage(product, colour.name))}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackWhatsAppClick({
                source: "product_page",
                productId: product.id,
                productName: product.name,
                colourName: colour.name,
              })
            }
            className="btn-whatsapp mt-6 w-full py-4 text-base sm:text-lg"
          >
            <MessageCircle className="h-6 w-6" />
            Order on WhatsApp
          </a>
          <p className="mt-3 text-center text-xs text-cream-muted">
            5 year warranty · Customized options available · Reply within minutes
          </p>
        </div>
      </div>

      {/* 7. Product reviews */}
      <section id="product-reviews-section" className="scroll-mt-24 pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="Verified buyers" title="Reviews for this Product" />
        </Reveal>

        {/* Action buttons for product-specific & overall reviews */}
        <Reveal delay={0.05}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSubmitReviewOpen(true)}
              className="btn-gold text-xs sm:text-sm"
            >
              <MessageSquarePlus className="h-4 w-4" />
              Write a Review for this Product
            </button>

            <button
              type="button"
              onClick={() => setShowAllProductReviews((prev) => !prev)}
              className="btn-outline-gold text-xs sm:text-sm"
            >
              {showAllProductReviews
                ? "Hide Product Reviews Grid"
                : `View All Reviews for this Product (${productSpecificReviews.length})`}
            </button>

            <Link
              to="/reviews"
              search={{ product: product.id }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night-card px-4 py-2.5 text-xs font-semibold text-cream-muted transition-colors hover:border-gold hover:text-gold sm:text-sm"
            >
              Open Dedicated Product Reviews Page <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to="/reviews"
              search={{}}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night-card px-4 py-2.5 text-xs font-semibold text-gold transition-colors hover:border-gold sm:text-sm"
            >
              View All Overall Reviews ({allReviews.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Reveal>

        {/* Expandable Product-Specific Reviews Grid */}
        {showAllProductReviews && (
          <div className="mt-8 rounded-3xl border border-gold/30 bg-night-card/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold text-cream">
                Customer Reviews for {product.name} ({productSpecificReviews.length})
              </h3>
              <span className="text-xs text-cream-muted">
                Click any review to open full photos & videos
              </span>
            </div>

            {productSpecificReviews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-cream-muted">
                  No direct reviews for {product.name} yet. Be the first to review!
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitReviewOpen(true)}
                  className="btn-gold mt-4 text-xs"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {productSpecificReviews.map((rev, idx) => (
                  <ReviewGridCard
                    key={rev.id || `${rev.name}-${idx}`}
                    review={rev}
                    onSelect={(r) => setSelectedReview(r)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <Reveal delay={0.1}>
          <ReviewsCoverflow
            reviews={coverflowReviews}
            onSelectReview={(r) => setSelectedReview(r)}
            className="mt-8"
          />
        </Reveal>
      </section>

      {/* 8. You may also like */}
      <section className="pt-14 sm:pt-20">
        <Reveal>
          <SectionHeading eyebrow="Complete the look" title="You May Also Like" />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Reveal>
      </section>

      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />

      <ReviewSubmitModal
        open={submitReviewOpen}
        onClose={() => setSubmitReviewOpen(false)}
        products={allProducts}
        defaultProductId={product.id}
        onSubmitReview={submitReview}
      />
    </div>
  );
}
