import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Stars } from "@/components/Stars";
import { getProduct } from "@/data/products";
import type { Review, ReviewItem } from "@/lib/store-types";
import { cn } from "@/lib/utils";

export function ReviewModal({
  review,
  onClose,
}: {
  review: (Review | ReviewItem) | null;
  onClose: () => void;
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [review]);

  useEffect(() => {
    if (!review) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (review.media.length > 1) {
        if (e.key === "ArrowRight") {
          setActiveMediaIndex((prev) => (prev + 1) % review.media.length);
        } else if (e.key === "ArrowLeft") {
          setActiveMediaIndex((prev) => (prev - 1 + review.media.length) % review.media.length);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [review, onClose]);

  if (!review) return null;

  const mediaList = review.media ?? [];
  const currentMedia = mediaList[activeMediaIndex];
  const linkedProduct = review.productId ? getProduct(review.productId) : undefined;
  const productTitle =
    ("productName" in review && review.productName) || linkedProduct?.name || undefined;

  const videoCount = mediaList.filter((m) => m.type === "video").length;
  const imageCount = mediaList.filter((m) => m.type === "image").length;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-maroon/70 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Customer review by ${review.name}`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-gold/40 bg-night-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-night-card/95 px-5 py-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold font-display text-lg font-bold text-night">
              {review.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-bold text-cream sm:text-xl">
                  {review.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold">
                  <CheckCircle2 className="h-3 w-3" /> Verified Customer
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-cream-muted">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                {review.area}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review details"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-night text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {/* Media Stage (if review includes videos or photos) */}
          {mediaList.length > 0 && currentMedia && (
            <div className="mb-6">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-night">
                {currentMedia.type === "video" ? (
                  <video
                    key={currentMedia.url}
                    src={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[460px] w-full object-contain"
                  />
                ) : (
                  <img
                    key={currentMedia.url}
                    src={currentMedia.url}
                    alt={`Review media ${activeMediaIndex + 1} by ${review.name}`}
                    className="max-h-[460px] w-full object-contain"
                  />
                )}

                {mediaList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMediaIndex(
                          (prev) => (prev - 1 + mediaList.length) % mediaList.length,
                        )
                      }
                      aria-label="Previous media"
                      className="absolute top-1/2 left-3 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-night/80 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-night"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaIndex((prev) => (prev + 1) % mediaList.length)}
                      aria-label="Next media"
                      className="absolute top-1/2 right-3 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-gold/40 bg-night/80 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-night"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-night/85 px-3 py-1 text-xs font-medium text-cream backdrop-blur-sm border border-border">
                    {currentMedia.type === "video" ? (
                      <>
                        <Film className="h-3.5 w-3.5 text-gold" /> Customer Video
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-3.5 w-3.5 text-gold" /> Customer Photo
                      </>
                    )}
                    {mediaList.length > 1 && ` (${activeMediaIndex + 1} / ${mediaList.length})`}
                  </span>
                </div>
              </div>

              {/* Media thumbnails strip when multiple photos/videos exist */}
              {mediaList.length > 1 && (
                <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1">
                  {mediaList.map((item, idx) => (
                    <button
                      key={item.url + idx}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={cn(
                        "relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition-all",
                        idx === activeMediaIndex
                          ? "border-gold ring-2 ring-gold/40"
                          : "border-border opacity-70 hover:opacity-100",
                      )}
                    >
                      {item.type === "video" ? (
                        <div className="relative h-full w-full bg-night">
                          <video
                            src={item.url}
                            muted
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 grid place-items-center bg-night/50 text-gold">
                            <Film className="h-5 w-5" />
                          </span>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`Thumbnail ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rating & Media Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-night p-4">
            <div className="flex items-center gap-3">
              <Stars rating={review.rating} />
              <span className="text-sm font-semibold text-gold">{review.rating}.0 / 5.0</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-cream-muted">
              {videoCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-medium text-gold">
                  <Film className="h-3.5 w-3.5" /> {videoCount} Video{videoCount > 1 ? "s" : ""}
                </span>
              )}
              {imageCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-night-card px-2.5 py-1 font-medium text-cream">
                  <ImageIcon className="h-3.5 w-3.5 text-gold" /> {imageCount} Photo
                  {imageCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Complete Uncut Review Text */}
          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wider text-gold uppercase">
              Full Customer Feedback
            </h3>
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-cream sm:text-lg">
              “{review.text}”
            </p>
          </div>

          {/* Linked Furniture Product Info */}
          {review.productId && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-night p-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-sm text-cream-muted">
                  Reviewed Product:{" "}
                  <strong className="text-cream">{productTitle ?? review.productId}</strong>
                </span>
              </div>
              <Link
                to="/product/$id"
                params={{ id: review.productId }}
                onClick={onClose}
                className="text-xs font-semibold text-gold hover:underline"
              >
                View Product Details →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
