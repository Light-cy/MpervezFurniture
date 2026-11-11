import { motion, useReducedMotion } from "framer-motion";
import { Expand, Film, Image as ImageIcon, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReviewModal } from "@/components/ReviewModal";
import { Stars } from "@/components/Stars";
import type { Review, ReviewMedia } from "@/data/reviews";
import type { ReviewItem } from "@/lib/store-types";
import { cn } from "@/lib/utils";

const SCALES: [number, number, number, number] = [1, 0.82, 0.7, 0.6];
const OPACITIES: [number, number, number, number] = [1, 0.5, 0.25, 0.12];
const BLURS: [number, number, number, number] = [0, 2, 4, 6];
const Z: [number, number, number, number] = [30, 20, 10, 5];

function MediaItem({ item, playing }: { item: ReviewMedia; playing: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [playing]);

  if (item.type === "image") {
    return (
      <img
        src={item.url}
        alt="Customer photo"
        loading="lazy"
        className="aspect-video w-full rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <video
        ref={videoRef}
        src={item.url}
        muted
        loop
        playsInline
        preload="metadata"
        controls={Boolean(reduceMotion)}
        className="aspect-video w-full object-cover"
      />
      {!playing && !reduceMotion && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-night/40">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/90 text-night">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Coverflow-style reviews carousel.
 *
 * The center card is full size with a gold border and glow; side cards are
 * smaller, dimmer and blurred behind it. Clicking the active review opens the
 * full-screen ReviewModal so customers can view all attached photos, watch
 * full videos with audio, and read the complete uncut review.
 */
export function ReviewsCoverflow({
  reviews,
  className,
  onSelectReview,
}: {
  reviews: (Review | ReviewItem)[];
  className?: string;
  onSelectReview?: (review: Review | ReviewItem) => void;
}) {
  const n = reviews.length;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [dims, setDims] = useState({ height: 450, spacing: 200 });
  const [internalModalReview, setInternalModalReview] = useState<(Review | ReviewItem) | null>(
    null,
  );
  const centerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const paused =
    userPaused || hovered || focused || Boolean(reduceMotion) || Boolean(internalModalReview);
  const goTo = (next: number) => setIndex(((next % n) + n) % n);

  const handleOpenReview = (review: Review | ReviewItem) => {
    if (onSelectReview) {
      onSelectReview(review);
    } else {
      setInternalModalReview(review);
    }
  };

  // Auto-advance every 4 seconds unless the visitor paused it.
  useEffect(() => {
    if (paused || n < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % n), 4000);
    return () => window.clearInterval(t);
  }, [paused, n]);

  // Measure the center card so the stage always fits it.
  useEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const measure = () =>
      setDims({ height: el.offsetHeight, spacing: Math.round(el.offsetWidth * 0.68) });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, n, reviews]);

  if (n === 0) return null;

  return (
    <>
      <div
        className={cn("relative overflow-hidden py-4", className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer reviews"
      >
        <p className="sr-only" aria-live="polite">
          {`Review ${index + 1} of ${n}: ${reviews[index]?.name ?? ""}`}
        </p>

        <div className="relative" style={{ height: dims.height }} suppressHydrationWarning>
          {reviews.map((review, i) => {
            let rel = (i - index + n) % n;
            if (rel > n / 2) rel -= n;
            const abs = Math.min(Math.abs(rel), 3);
            const isCenter = rel === 0;
            const interactive = !isCenter && abs <= 2;
            const videoCount = review.media.filter((m) => m.type === "video").length;
            const imageCount = review.media.filter((m) => m.type === "image").length;

            return (
              <div
                key={`${review.name}-${i}`}
                aria-hidden={abs > 2 ? true : undefined}
                className="pointer-events-none absolute inset-0 flex items-start justify-center"
              >
                <motion.div
                  ref={isCenter ? centerRef : undefined}
                  suppressHydrationWarning
                  role="button"
                  tabIndex={isCenter || interactive ? 0 : -1}
                  aria-label={
                    isCenter
                      ? `Open full review and media from ${review.name}`
                      : interactive
                        ? `Show review from ${review.name}`
                        : undefined
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (isCenter) handleOpenReview(review);
                      else if (interactive) goTo(i);
                    }
                  }}
                  className={cn(
                    "pointer-events-auto w-[78%] max-w-[420px] rounded-2xl border bg-night-card p-4 sm:p-5",
                    "cursor-pointer",
                  )}
                  animate={{
                    x: rel * dims.spacing,
                    scale: SCALES[abs] ?? 1,
                    opacity: OPACITIES[abs] ?? 1,
                    filter: `blur(${BLURS[abs] ?? 0}px)`,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 220, damping: 28, mass: 0.9 }
                  }
                  style={{
                    zIndex: Z[abs],
                    borderColor: isCenter ? "var(--gold)" : undefined,
                    boxShadow: isCenter
                      ? "0 14px 44px -12px oklch(0.625 0.118 75 / 0.35)"
                      : undefined,
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) goTo(index + 1);
                    else if (info.offset.x > 50) goTo(index - 1);
                  }}
                  onClick={() => {
                    if (isCenter) handleOpenReview(review);
                    else if (interactive) goTo(i);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-light to-gold font-display text-lg font-bold text-night">
                      {review.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold sm:text-base">{review.name}</p>
                      <p className="truncate text-xs text-cream-muted">{review.area}</p>
                    </div>
                    <Stars rating={review.rating} className="shrink-0" />
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm text-cream-muted">{review.text}</p>
                  {review.media.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {review.media.slice(0, 2).map((m, mi) => (
                        <MediaItem
                          key={mi}
                          item={m}
                          playing={isCenter && !userPaused && !reduceMotion}
                        />
                      ))}
                    </div>
                  )}

                  {/* Footer bar showing media badges & click-to-open cue */}
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-cream-muted">
                    <div className="flex items-center gap-2">
                      {videoCount > 0 && (
                        <span className="inline-flex items-center gap-1 font-medium text-gold">
                          <Film className="h-3.5 w-3.5" /> {videoCount} Video
                          {videoCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {imageCount > 0 && (
                        <span className="inline-flex items-center gap-1 font-medium text-cream">
                          <ImageIcon className="h-3.5 w-3.5 text-gold" /> {imageCount} Photo
                          {imageCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {videoCount === 0 && imageCount === 0 && <span>Verified Review</span>}
                    </div>
                    <span className="inline-flex items-center gap-1 font-semibold text-gold hover:underline">
                      <Expand className="h-3 w-3" /> Open Full Review
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-pressed={userPaused}
              aria-label={userPaused ? "Play review slideshow" : "Pause review slideshow"}
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-night"
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}

          <div className="flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-gold" : "w-2 bg-gold/30 hover:bg-gold/60",
                )}
              />
            ))}
          </div>

          {!reduceMotion && <span className="w-9" aria-hidden="true" />}
        </div>
      </div>

      {!onSelectReview && (
        <ReviewModal review={internalModalReview} onClose={() => setInternalModalReview(null)} />
      )}
    </>
  );
}
