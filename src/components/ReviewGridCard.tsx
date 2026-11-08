import { Expand, Film, Image as ImageIcon, Play } from "lucide-react";
import { Stars } from "@/components/Stars";
import { getProduct } from "@/data/products";
import type { Review, ReviewItem } from "@/lib/store-types";

export function ReviewGridCard({
  review,
  onSelect,
}: {
  review: Review | ReviewItem;
  onSelect: (review: Review | ReviewItem) => void;
}) {
  const videoCount = review.media.filter((m) => m.type === "video").length;
  const imageCount = review.media.filter((m) => m.type === "image").length;
  const primaryMedia = review.media[0];
  const linkedProduct = review.productId ? getProduct(review.productId) : undefined;
  const productTitle =
    ("productName" in review && review.productName) || linkedProduct?.name || undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(review)}
      className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-night-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/10"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold font-display text-lg font-bold text-night">
            {review.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-cream group-hover:text-gold">
              {review.name}
            </h3>
            <p className="truncate text-xs text-cream-muted">{review.area}</p>
          </div>
          <Stars rating={review.rating} className="shrink-0" />
        </div>

        {productTitle && (
          <div className="mt-3 inline-block rounded-md border border-gold/25 bg-night px-2.5 py-1 text-[11px] font-medium text-gold">
            {productTitle}
          </div>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream-muted">
          “{review.text}”
        </p>

        {primaryMedia && (
          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-border bg-night">
            {primaryMedia.type === "video" ? (
              <>
                <video
                  src={primaryMedia.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 grid place-items-center bg-night/40">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-night shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </div>
              </>
            ) : (
              <img
                src={primaryMedia.url}
                alt={`Review photo by ${review.name}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {review.media.length > 1 && (
              <span className="absolute right-2.5 bottom-2.5 rounded-full bg-night/85 px-2.5 py-1 text-[11px] font-semibold text-gold backdrop-blur-sm border border-gold/30">
                +{review.media.length - 1} more media
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        <div className="flex items-center gap-2.5 text-cream-muted">
          {videoCount > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-gold">
              <Film className="h-3.5 w-3.5" /> {videoCount} Video{videoCount > 1 ? "s" : ""}
            </span>
          )}
          {imageCount > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-cream">
              <ImageIcon className="h-3.5 w-3.5 text-gold" /> {imageCount} Photo
              {imageCount > 1 ? "s" : ""}
            </span>
          )}
          {videoCount === 0 && imageCount === 0 && <span>Verified Feedback</span>}
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-gold group-hover:underline">
          <Expand className="h-3.5 w-3.5" /> Full Review
        </span>
      </div>
    </button>
  );
}
