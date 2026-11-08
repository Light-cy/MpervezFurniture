import { createFileRoute, Link } from "@tanstack/react-router";
import { Film, Image as ImageIcon, MessageSquarePlus, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { ReviewGridCard } from "@/components/ReviewGridCard";
import { ReviewModal } from "@/components/ReviewModal";
import { ReviewsCoverflow } from "@/components/ReviewsCoverflow";
import { ReviewSubmitModal } from "@/components/ReviewSubmitModal";
import { SectionHeading } from "@/components/SectionHeading";
import { absoluteUrl } from "@/config/site";
import { useCatalogueProducts, useCustomerReviews } from "@/lib/store-client";
import type { Review, ReviewItem } from "@/lib/store-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  validateSearch: (search: Record<string, unknown>): { product?: string } => {
    const p = search["product"];
    return typeof p === "string" && p ? { product: p } : {};
  },
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Customer Reviews | Pervez Furniture" },
      {
        name: "description",
        content:
          "What our customers in DHA, Gulberg and Bahria Town say about Pervez Furniture. Customer reviews with photos and videos.",
      },
      { property: "og:title", content: "Customer Reviews | Pervez Furniture" },
      {
        property: "og:description",
        content: "Customer reviews with photos and videos from Lahore.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/reviews") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/reviews") }],
  }),
});

type MediaFilter = "all" | "video" | "photo";

function ReviewsPage() {
  const { product: productParam } = Route.useSearch();
  const { data: products } = useCatalogueProducts();
  const { reviews, submitReview } = useCustomerReviews();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>(productParam ?? "");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("all");
  const [activeReview, setActiveReview] = useState<(Review | ReviewItem) | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  const effectiveProductId = productParam ?? selectedProductFilter;
  const activeProduct = effectiveProductId
    ? products.find((p) => p.id === effectiveProductId)
    : undefined;

  const filteredReviews = reviews.filter((r) => {
    if (effectiveProductId && r.productId !== effectiveProductId) {
      return false;
    }
    if (mediaFilter === "video") {
      return r.media.some((m) => m.type === "video");
    }
    if (mediaFilter === "photo") {
      return r.media.some((m) => m.type === "image");
    }
    return true;
  });

  const totalVideoReviews = reviews.filter((r) => r.media.some((m) => m.type === "video")).length;
  const totalPhotoReviews = reviews.filter((r) => r.media.some((m) => m.type === "image")).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Reveal>
        <SectionHeading
          as="h1"
          eyebrow="What Lahore says"
          title={activeProduct ? `Reviews for ${activeProduct.name}` : "Customer Reviews & Stories"}
        />
      </Reveal>

      {/* Summary & Write a Review Action Bar */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gold/30 bg-night-card p-5 sm:flex-row sm:p-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold border border-gold/30">
                <Star className="h-6 w-6 fill-gold text-gold" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-cream">{avgRating} / 5.0</p>
                <p className="text-xs text-cream-muted">
                  Based on <strong className="text-cream">{reviews.length}</strong> verified reviews
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-[1px] bg-border sm:block" />

            <div className="flex items-center gap-4 text-xs text-cream-muted">
              <span className="inline-flex items-center gap-1.5">
                <Film className="h-4 w-4 text-gold" />
                <strong className="text-cream">{totalVideoReviews}</strong> Video Reviews
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-gold" />
                <strong className="text-cream">{totalPhotoReviews}</strong> Photo Reviews
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubmitModalOpen(true)}
            className="btn-gold w-full shrink-0 sm:w-auto"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Write a Review
          </button>
        </div>
      </Reveal>

      {/* Featured Coverflow Carousel */}
      <Reveal delay={0.1}>
        <ReviewsCoverflow
          reviews={filteredReviews.length > 0 ? filteredReviews : reviews}
          onSelectReview={(r) => setActiveReview(r)}
          className="mt-8"
        />
      </Reveal>

      {/* All Reviews Section with Product & Media Filters */}
      <section id="all-reviews-list" className="mt-12 scroll-mt-24 pt-6 border-t border-border/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">
              {activeProduct
                ? `All Customer Reviews for ${activeProduct.name}`
                : "All Showroom Customer Reviews"}
            </h2>
            <p className="mt-1 text-xs text-cream-muted">
              Click any review card below to open full photos, watch customer videos, and read the
              complete story.
            </p>
          </div>

          {/* Filter by Product Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter reviews by product"
              value={effectiveProductId}
              onChange={(e) => {
                setSelectedProductFilter(e.target.value);
              }}
              className="rounded-xl border border-border bg-night-card px-3.5 py-2 text-xs font-medium text-cream focus:border-gold focus:outline-none sm:text-sm"
            >
              <option value="">All Showroom Products ({reviews.length})</option>
              {products.map((p) => {
                const count = reviews.filter((r) => r.productId === p.id).length;
                return (
                  <option key={p.id} value={p.id}>
                    {p.name} ({count})
                  </option>
                );
              })}
            </select>

            {(productParam || selectedProductFilter) && (
              <Link
                to="/reviews"
                search={{}}
                onClick={() => setSelectedProductFilter("")}
                className="rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold hover:text-night"
              >
                View All Overall Reviews
              </Link>
            )}
          </div>
        </div>

        {/* Media Type Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMediaFilter("all")}
            className={cn(
              "rounded-md border px-4 py-2 text-xs font-semibold transition-colors",
              mediaFilter === "all"
                ? "border-gold bg-gold text-night"
                : "border-border bg-night-card text-cream-muted hover:border-gold/50 hover:text-cream",
            )}
          >
            All Stories ({filteredReviews.length})
          </button>
          <button
            type="button"
            onClick={() => setMediaFilter("video")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-xs font-semibold transition-colors",
              mediaFilter === "video"
                ? "border-gold bg-gold text-night"
                : "border-border bg-night-card text-cream-muted hover:border-gold/50 hover:text-cream",
            )}
          >
            <Film className="h-3.5 w-3.5" /> With Videos ({totalVideoReviews})
          </button>
          <button
            type="button"
            onClick={() => setMediaFilter("photo")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-xs font-semibold transition-colors",
              mediaFilter === "photo"
                ? "border-gold bg-gold text-night"
                : "border-border bg-night-card text-cream-muted hover:border-gold/50 hover:text-cream",
            )}
          >
            <ImageIcon className="h-3.5 w-3.5" /> With Photos ({totalPhotoReviews})
          </button>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-night-card p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h3 className="mt-3 font-display text-lg font-semibold text-cream">
              No matching reviews yet
            </h3>
            <p className="mt-1 text-sm text-cream-muted">
              Be the first to share your experience and upload photos or video!
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitModalOpen(true)}
                className="btn-gold text-xs"
              >
                <MessageSquarePlus className="h-4 w-4" /> Write a Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedProductFilter("");
                  setMediaFilter("all");
                }}
                className="btn-outline-gold text-xs"
              >
                Show All Showroom Reviews
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReviews.map((r, i) => (
              <ReviewGridCard
                key={("id" in r && r.id) || `${r.name}-${i}`}
                review={r}
                onSelect={(rev) => setActiveReview(rev)}
              />
            ))}
          </div>
        )}
      </section>

      <ReviewModal review={activeReview} onClose={() => setActiveReview(null)} />

      <ReviewSubmitModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        products={products}
        defaultProductId={effectiveProductId || undefined}
        onSubmitReview={submitReview}
      />
    </div>
  );
}
