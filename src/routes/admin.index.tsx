import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Edit3,
  ExternalLink,
  LogOut,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminProductModal } from "@/components/AdminProductModal";
import { CATEGORIES, formatPrice, type Product } from "@/data/products";
import { fetchAdminSession, useCatalogueProducts } from "@/lib/store-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
  head: () => ({
    meta: [
      { title: "Product Catalogue Admin | Pervez Furniture" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products } = useCatalogueProducts();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Product management state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    void fetchAdminSession().then((session) => {
      if (!mounted) return;
      if (!session.authenticated) {
        void navigate({ to: "/admin/login" });
        return;
      }
      setAdminEmail(session.email ?? "admin@pervezfurniture.pk");
      setCheckingAuth(false);
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    await navigate({ to: "/admin/login" });
  };

  const handleSaveProduct = async (payload: Partial<Product>) => {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as {
      products?: Product[];
      error?: string;
    };
    if (!res.ok) {
      throw new Error(data.error || "Failed to save product.");
    }
    if (Array.isArray(data.products)) {
      queryClient.setQueryData(["pf-catalogue-products"], data.products);
    } else {
      await queryClient.invalidateQueries({ queryKey: ["pf-catalogue-products"] });
    }
  };

  const handleToggleBestSeller = async (prod: Product) => {
    await handleSaveProduct({ ...prod, bestSeller: !prod.bestSeller });
  };

  const handleDeleteProduct = async (prod: Product) => {
    if (!window.confirm(`Delete "${prod.name}" from the catalogue?`)) return;
    const res = await fetch(`/api/admin/products/${encodeURIComponent(prod.id)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      const data = (await res.json()) as { products?: Product[] };
      if (Array.isArray(data.products)) {
        queryClient.setQueryData(["pf-catalogue-products"], data.products);
      } else {
        await queryClient.invalidateQueries({ queryKey: ["pf-catalogue-products"] });
      }
    }
  };

  if (checkingAuth) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-[1536px] items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="mt-3 text-sm text-cream-muted">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
      {/* Top Admin Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gold/30 bg-night-card p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/15 px-3 py-0.5 text-xs font-semibold text-gold">
              <ShieldCheck className="h-3.5 w-3.5" /> Catalogue Manager
            </span>
            <span className="text-xs text-cream-muted">{adminEmail}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
            Pervez Furniture — Products Admin
          </h1>
          <p className="mt-1 text-xs text-cream-muted">
            Add, edit, or remove furniture listings, prices, colour finishes, and photos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night px-4 py-2 text-xs font-semibold text-gold">
            <Package className="h-3.5 w-3.5" /> {products.length} Products
          </span>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night px-4 py-2 text-xs font-semibold text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Live Store
          </Link>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="inline-flex items-center gap-1.5 rounded-full border border-royal/50 bg-royal/15 px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-royal hover:text-on-maroon"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* CATALOGUE PRODUCTS MANAGEMENT */}
      <div className="mt-6 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-night-card p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-cream-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
                className="w-full rounded-xl border border-border bg-night py-2 pr-3.5 pl-10 text-xs text-cream focus:border-gold focus:outline-none sm:text-sm"
              />
            </div>

            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-border bg-night px-3.5 py-2 text-xs text-cream focus:border-gold focus:outline-none sm:text-sm"
            >
              <option value="">All Categories ({products.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
            className="btn-gold shrink-0 px-5 py-2.5 text-xs sm:text-sm"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </button>
        </div>

        {/* Products List */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((prod) => {
            const catLabel = CATEGORIES.find((c) => c.id === prod.category)?.label ?? prod.category;
            return (
              <div
                key={prod.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-night-card transition-colors hover:border-gold/40"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-night">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="h-full w-full object-cover"
                    />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold text-night">
                        {prod.badge}
                      </span>
                    )}
                    <span className="absolute right-2.5 bottom-2.5 rounded-md border border-border bg-night/85 px-2 py-0.5 text-[10px] font-medium text-cream backdrop-blur-sm">
                      {catLabel}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-1 text-base font-bold text-cream">{prod.name}</h3>
                    <div className="mt-1 flex items-baseline gap-2">
                      <p className="text-base font-bold text-cream">{formatPrice(prod.price)}</p>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-xs text-cream-muted line-through">
                          {formatPrice(prod.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-cream-muted">
                      {prod.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-cream-muted">
                      <span>{prod.colours.length} colour finishes</span>
                      <button
                        type="button"
                        onClick={() => void handleToggleBestSeller(prod)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-semibold transition-colors",
                          prod.bestSeller
                            ? "border-gold bg-gold/15 text-gold"
                            : "border-border text-cream-muted hover:border-gold/40",
                        )}
                      >
                        <Sparkles className="h-3 w-3" />
                        {prod.bestSeller ? "Best Seller ★" : "Mark Best Seller"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(prod);
                      setProductModalOpen(true);
                    }}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-night"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Product
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteProduct(prod)}
                    aria-label={`Delete ${prod.name}`}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-border text-cream-muted transition-colors hover:border-royal hover:bg-royal hover:text-on-maroon"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AdminProductModal
        open={productModalOpen}
        product={editingProduct}
        onClose={() => setProductModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
