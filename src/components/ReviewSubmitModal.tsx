import { CheckCircle2, Film, ImagePlus, Loader2, Star, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Product } from "@/data/products";
import { uploadMediaToR2 } from "@/lib/r2-client";
import type { ReviewItem, ReviewMedia } from "@/lib/store-types";
import { cn } from "@/lib/utils";

interface UploadingFileState {
  id: string;
  name: string;
  progress: number;
  isVideo: boolean;
}

export function ReviewSubmitModal({
  open,
  onClose,
  products,
  defaultProductId,
  onSubmitReview,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
  defaultProductId?: string | undefined;
  onSubmitReview: (input: {
    name: string;
    area: string;
    rating: number;
    text: string;
    productId?: string | undefined;
    media: ReviewMedia[];
  }) => Promise<ReviewItem>;
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [rating, setRating] = useState(5);
  const [productId, setProductId] = useState(defaultProductId ?? "");
  const [text, setText] = useState("");
  const [media, setMedia] = useState<ReviewMedia[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFileState[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setProductId(defaultProductId ?? "");
      setError(null);
      setSuccess(false);
    }
  }, [open, defaultProductId]);

  if (!open) return null;

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      const tempId = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const isVideo = file.type.startsWith("video/");

      setUploadingFiles((prev) => [...prev, { id: tempId, name: file.name, progress: 0, isVideo }]);

      try {
        const result = await uploadMediaToR2(file, "reviews", (pct) => {
          setUploadingFiles((prev) =>
            prev.map((u) => (u.id === tempId ? { ...u, progress: pct } : u)),
          );
        });

        setMedia((prev) => [...prev, { type: result.mediaType, url: result.url }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload file.");
      } finally {
        setUploadingFiles((prev) => prev.filter((u) => u.id !== tempId));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!area.trim()) {
      setError("Please enter your area or city (e.g. DHA Phase 6, Lahore).");
      return;
    }
    if (!text.trim()) {
      setError("Please write your review feedback.");
      return;
    }
    if (uploadingFiles.length > 0) {
      setError("Please wait for your photos/videos to finish uploading.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitReview({
        name: name.trim(),
        area: area.trim(),
        rating,
        text: text.trim(),
        productId: productId || undefined,
        media,
      });
      setSuccess(true);
      setName("");
      setArea("");
      setRating(5);
      setText("");
      setMedia([]);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-night/85 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Write a customer review"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-gold/40 bg-night-card p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gold uppercase">
              Share Your Experience
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-cream sm:text-2xl">
              Write a Customer Review
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review form"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-night text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-gold" />
            <h3 className="mt-4 font-display text-2xl font-bold text-cream">
              Shukriya! Review Published
            </h3>
            <p className="mt-2 text-sm text-cream-muted">
              Your review and media are now live on Pervez Furniture.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="rounded-xl border border-royal/60 bg-royal/15 px-4 py-3 text-xs font-medium text-cream">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="review-customer-name"
                  className="block text-xs font-semibold text-cream"
                >
                  Your Full Name <span className="text-gold">*</span>
                </label>
                <input
                  id="review-customer-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed Raza"
                  className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-muted/50 focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="review-customer-area"
                  className="block text-xs font-semibold text-cream"
                >
                  Area / City <span className="text-gold">*</span>
                </label>
                <input
                  id="review-customer-area"
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. DHA Phase 6, Lahore"
                  className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-muted/50 focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-semibold text-cream">
                  Your Rating <span className="text-gold">*</span>
                </span>
                <div className="mt-1.5 flex items-center gap-1.5 rounded-xl border border-border bg-night px-3.5 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} out of 5 stars`}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          star <= rating ? "fill-gold text-gold" : "text-cream-muted/40",
                        )}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-gold">{rating} / 5</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-product-select"
                  className="block text-xs font-semibold text-cream"
                >
                  Furniture Item (Optional)
                </label>
                <select
                  id="review-product-select"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
                >
                  <option value="">General Showroom Experience</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="review-message-text"
                className="block text-xs font-semibold text-cream"
              >
                Your Review <span className="text-gold">*</span>
              </label>
              <textarea
                id="review-message-text"
                required
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts on wood quality, carving finish, comfort, and delivery..."
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-muted/50 focus:border-gold focus:outline-none"
              />
            </div>

            {/* Cloudflare R2 Photo & Video Upload Section */}
            <div>
              <div className="flex items-center justify-between">
                <span className="block text-xs font-semibold text-cream">
                  Add Photos or Video (Optional)
                </span>
                <span className="text-[11px] text-cream-muted">
                  Powered by Cloudflare R2 · Fast Video Streaming
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={(e) => void handleFilesSelected(e.target.files)}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/40 bg-night/70 px-4 py-5 text-center transition-colors hover:border-gold hover:bg-night"
              >
                <div className="flex items-center gap-2 text-gold">
                  <UploadCloud className="h-5 w-5" />
                  <ImagePlus className="h-5 w-5" />
                  <Film className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-cream">
                  Click to upload customer photos or MP4 video
                </span>
                <span className="text-[11px] text-cream-muted">
                  Supports JPG, PNG, WEBP & MP4/MOV videos
                </span>
              </button>

              {/* Active Upload Progress Bars */}
              {uploadingFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadingFiles.map((u) => (
                    <div
                      key={u.id}
                      className="rounded-xl border border-border bg-night p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-cream">
                        <span className="flex items-center gap-1.5 truncate font-medium">
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />
                          Uploading {u.isVideo ? "video" : "photo"}: {u.name}
                        </span>
                        <span className="font-semibold text-gold">{u.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-night-card">
                        <div
                          className="h-full bg-gold transition-all duration-200"
                          style={{ width: `${u.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Uploaded Media Previews */}
              {media.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                  {media.map((item, idx) => (
                    <div
                      key={item.url + idx}
                      className="group relative aspect-video overflow-hidden rounded-xl border border-gold/30 bg-night"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={`Uploaded ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setMedia((prev) => prev.filter((_, i) => i !== idx))}
                        aria-label="Remove uploaded media"
                        className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-night/85 text-cream hover:bg-royal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-cream-muted hover:border-gold hover:text-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingFiles.length > 0}
                className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {submitting ? "Publishing..." : "Publish Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
