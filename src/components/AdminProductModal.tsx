import { ImagePlus, Loader2, Plus, Sparkles, Trash2, UploadCloud, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CATEGORIES,
  buildDefaultColours,
  type Category,
  type Product,
  type ProductColour,
} from "@/data/products";
import { uploadMediaToR2 } from "@/lib/r2-client";

export function AdminProductModal({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (payload: Partial<Product>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("beds");
  const [price, setPrice] = useState("150000");
  const [originalPrice, setOriginalPrice] = useState("");
  const [badge, setBadge] = useState<"" | "NEW" | "HOT" | "SALE">("");
  const [bestSeller, setBestSeller] = useState(false);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [colours, setColours] = useState<ProductColour[]>([]);
  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price));
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
      setBadge(product.badge ?? "");
      setBestSeller(product.bestSeller);
      setDescription(product.description);
      setImages([...product.images]);
      setColours(product.colours.map((c) => ({ ...c })));
      setSpecsList(Object.entries(product.specs).map(([key, value]) => ({ key, value })));
    } else {
      setName("");
      setCategory("beds");
      setPrice("185000");
      setOriginalPrice("");
      setBadge("NEW");
      setBestSeller(false);
      setDescription(
        "Hand-crafted in Lahore using seasoned sheesham wood with a 5-year structural warranty.",
      );
      setImages([]);
      setColours(buildDefaultColours(""));
      setSpecsList([
        { key: "Material", value: "Pure Seasoned Sheesham Wood" },
        { key: "Foam", value: "Master Molty / High-Density Orthotic Foam" },
        { key: "Warranty", value: "5 years" },
        {
          key: "Delivery",
          value: "Available across Lahore & Pakistan (Charges as per distance)",
        },
      ]);
    }
  }, [open, product]);

  if (!open) return null;

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const res = await uploadMediaToR2(file, "products", (pct) => {
          setUploadProgress(pct);
        });
        uploadedUrls.push(res.url);
      }
      setImages((prev) => {
        const next = [...prev, ...uploadedUrls];
        setColours((currColours) =>
          currColours.map((c) => ({
            ...c,
            image: c.image || next[0] || "",
          })),
        );
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }

    const numericPrice = Math.round(Number(price));
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price in PKR.");
      return;
    }

    const numericOriginalPrice = originalPrice.trim()
      ? Math.round(Number(originalPrice))
      : undefined;
    if (
      numericOriginalPrice !== undefined &&
      (Number.isNaN(numericOriginalPrice) || numericOriginalPrice <= 0)
    ) {
      setError("Please enter a valid original price or leave it blank.");
      return;
    }

    const fallbackImage = images[0] || product?.images[0] || "/og-image.jpg";
    const finalImages = images.length > 0 ? images : [fallbackImage];

    const finalColours: ProductColour[] =
      colours.length > 0
        ? colours.map((c) => ({
            name: c.name.trim() || "Classic",
            hex: c.hex || "#C5A059",
            image: c.image || finalImages[0]!,
            ...(c.filter ? { filter: c.filter } : {}),
          }))
        : buildDefaultColours(finalImages[0]!, finalImages[1]);

    const specsRecord: Record<string, string> = {};
    for (const row of specsList) {
      if (row.key.trim() && row.value.trim()) {
        specsRecord[row.key.trim()] = row.value.trim();
      }
    }

    setSaving(true);
    try {
      await onSave({
        ...(product?.id ? { id: product.id } : {}),
        name: name.trim(),
        category,
        price: numericPrice,
        ...(numericOriginalPrice && numericOriginalPrice > numericPrice
          ? { originalPrice: numericOriginalPrice }
          : {}),
        ...(badge ? { badge } : {}),
        bestSeller,
        description: description.trim(),
        images: finalImages,
        colours: finalColours,
        specs: specsRecord,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-night/85 p-3 backdrop-blur-md sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={product ? `Edit ${product.name}` : "Add new product"}
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gold/40 bg-night-card p-5 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gold uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Catalogue Editor
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-cream sm:text-2xl">
              {product ? `Edit Product: ${product.name}` : "Add New Furniture Product"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product editor"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-night text-cream-muted hover:border-gold hover:text-gold"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {error && (
            <div className="rounded-xl border border-royal/60 bg-royal/15 px-4 py-3 text-xs font-medium text-cream">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="prod-name-input" className="block text-xs font-semibold text-cream">
                Product Name <span className="text-gold">*</span>
              </label>
              <input
                id="prod-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Royal Chinioti Carved King Bed Set"
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="prod-category-select"
                className="block text-xs font-semibold text-cream"
              >
                Category <span className="text-gold">*</span>
              </label>
              <select
                id="prod-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prod-price-input" className="block text-xs font-semibold text-cream">
                Selling Price (Whole PKR Rupees) <span className="text-gold">*</span>
              </label>
              <input
                id="prod-price-input"
                type="number"
                required
                min={1000}
                step={500}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-cream-muted">
                Final amount the customer pays
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="prod-orig-price-input"
                  className="block text-xs font-semibold text-cream"
                >
                  Original Price / Cut Price (PKR)
                </label>
                {Number(originalPrice) > Number(price) && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gold border border-gold/25">
                    {Math.round(
                      ((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100,
                    )}
                    % OFF
                  </span>
                )}
              </div>
              <input
                id="prod-orig-price-input"
                type="number"
                min={1000}
                step={500}
                placeholder="e.g. 535000 (Leave blank for no discount)"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-cream-muted">
                {originalPrice && Number(originalPrice) > Number(price)
                  ? `Shows cut price with ${Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% discount badge`
                  : "Leave empty if product has no discount"}
              </span>
            </div>

            <div>
              <label htmlFor="prod-badge-select" className="block text-xs font-semibold text-cream">
                Highlight Badge
              </label>
              <select
                id="prod-badge-select"
                value={badge}
                onChange={(e) => setBadge(e.target.value as "" | "NEW" | "HOT" | "SALE")}
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              >
                <option value="">No Badge</option>
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="SALE">SALE</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-night px-4 py-2.5 text-sm font-medium text-cream hover:border-gold/50">
                <input
                  type="checkbox"
                  checked={bestSeller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="h-4 w-4 accent-gold"
                />
                <span>Feature in "Best Sellers" on Home Page</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="prod-desc-input" className="block text-xs font-semibold text-cream">
              Product Description
            </label>
            <textarea
              id="prod-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>

          {/* Product Photos (Cloudflare R2) */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cream">
                Product Photos (Cloudflare R2)
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
              >
                <ImagePlus className="h-3.5 w-3.5" /> Upload Photos
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => void handleUploadImages(e.target.files)}
              className="hidden"
            />

            {uploading && (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-night px-3.5 py-2 text-xs text-gold">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading to Cloudflare R2 ({uploadProgress}%)...
              </div>
            )}

            {images.length === 0 ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold/40 bg-night/60 py-6 text-xs text-cream-muted hover:border-gold hover:text-cream"
              >
                <UploadCloud className="h-6 w-6 text-gold" />
                <span>Click to upload product photos to Cloudflare R2</span>
              </button>
            ) : (
              <div className="mt-2.5 flex flex-wrap gap-2.5">
                {images.map((imgUrl, idx) => (
                  <div
                    key={imgUrl + idx}
                    className="group relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-night"
                  >
                    <img src={imgUrl} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove product photo"
                      className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-night/90 text-cream hover:bg-royal hover:text-on-maroon"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colour Swatches */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-cream">
                Available Colour Finishes (Default: Brown, Black, Grey, Off-White)
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setColours(buildDefaultColours(images[0] || "", images[1]))}
                  className="text-[11px] font-medium text-cream-muted hover:text-gold hover:underline"
                >
                  Reset Default 4
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setColours((prev) => [
                      ...prev,
                      {
                        name: "New Colour",
                        hex: "#C5A059",
                        image: images[0] || "",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Colour
                </button>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {colours.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-border bg-night p-2"
                >
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) =>
                      setColours((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, hex: e.target.value } : item,
                        ),
                      )
                    }
                    aria-label="Colour swatch hex"
                    className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                  />
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) =>
                      setColours((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, name: e.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Colour name (e.g. Royal Gold)"
                    className="flex-1 rounded-lg border border-border bg-night-card px-3 py-1.5 text-xs text-cream focus:border-gold focus:outline-none"
                  />
                  {colours.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setColours((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove colour"
                      className="p-1.5 text-cream-muted hover:text-royal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cream">Specifications Table</span>
              <button
                type="button"
                onClick={() => setSpecsList((prev) => [...prev, { key: "", value: "" }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add Spec Row
              </button>
            </div>

            <div className="mt-2 space-y-2">
              {specsList.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.key}
                    onChange={(e) =>
                      setSpecsList((prev) =>
                        prev.map((r, i) => (i === idx ? { ...r, key: e.target.value } : r)),
                      )
                    }
                    placeholder="Label (e.g. Dimensions)"
                    className="w-1/3 rounded-xl border border-border bg-night px-3 py-2 text-xs text-cream focus:border-gold focus:outline-none"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) =>
                      setSpecsList((prev) =>
                        prev.map((r, i) => (i === idx ? { ...r, value: e.target.value } : r)),
                      )
                    }
                    placeholder="Value (e.g. King 6x6.5 ft)"
                    className="flex-1 rounded-xl border border-border bg-night px-3 py-2 text-xs text-cream focus:border-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSpecsList((prev) => prev.filter((_, i) => i !== idx))}
                    aria-label="Remove specification row"
                    className="p-1.5 text-cream-muted hover:text-royal"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-cream-muted hover:border-gold hover:text-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : product ? "Save Product Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
