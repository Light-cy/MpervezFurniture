import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PRODUCTS, type Product } from "@/data/products";
import { REVIEWS } from "@/data/reviews";
import type {
  AnalyticsSummary,
  ReviewItem,
  ReviewMedia,
  ShowroomSettings,
} from "@/lib/store-types";

const INITIAL_REVIEWS: ReviewItem[] = REVIEWS.map((r, index) => {
  const matchedProduct = r.productId ? PRODUCTS.find((p) => p.id === r.productId) : undefined;
  return {
    ...r,
    id: `rev-seed-${index + 1}`,
    createdAt: new Date(Date.now() - (index + 2) * 86400000 * 3).toISOString(),
    productName: matchedProduct?.name,
  };
});

const INITIAL_SETTINGS: ShowroomSettings = {
  announcementEnabled: true,
  announcementText:
    "Factory Rates Furniture Available · Custom Sizes & Fabrics · 5-Year Solid Sheesham Warranty",
  showroomNotice:
    "Visit our Margzar Scheme Showroom in Lahore — Open All Days 12:00 PM to 10:00 PM",
  r2PublicDomain: "https://media.pervezfurniture.example",
};

export function useCatalogueProducts() {
  return useQuery({
    queryKey: ["pf-catalogue-products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products");
      if (!res.ok) return PRODUCTS;
      const data = (await res.json()) as { products?: Product[] };
      return Array.isArray(data.products) && data.products.length > 0 ? data.products : PRODUCTS;
    },
    initialData: PRODUCTS,
    staleTime: 15_000,
  });
}

export function useShowroomSettings() {
  return useQuery({
    queryKey: ["pf-showroom-settings"],
    queryFn: async (): Promise<ShowroomSettings> => {
      const res = await fetch("/api/settings");
      if (!res.ok) return INITIAL_SETTINGS;
      const data = (await res.json()) as { settings?: ShowroomSettings };
      return data.settings ?? INITIAL_SETTINGS;
    },
    initialData: INITIAL_SETTINGS,
    staleTime: 30_000,
  });
}

export function useCustomerReviews() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pf-customer-reviews"],
    queryFn: async (): Promise<ReviewItem[]> => {
      const res = await fetch("/api/reviews");
      if (!res.ok) return INITIAL_REVIEWS;
      const data = (await res.json()) as { reviews?: ReviewItem[] };
      return Array.isArray(data.reviews) && data.reviews.length > 0
        ? data.reviews
        : INITIAL_REVIEWS;
    },
    initialData: INITIAL_REVIEWS,
    staleTime: 10_000,
  });

  const submitReview = async (input: {
    name: string;
    area: string;
    rating: number;
    text: string;
    productId?: string | undefined;
    media: ReviewMedia[];
  }): Promise<ReviewItem> => {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as {
      review?: ReviewItem;
      reviews?: ReviewItem[];
      error?: string;
    };
    if (!res.ok || !data.review) {
      throw new Error(data.error || "Could not submit review.");
    }
    if (Array.isArray(data.reviews)) {
      queryClient.setQueryData(["pf-customer-reviews"], data.reviews);
    } else {
      await queryClient.invalidateQueries({ queryKey: ["pf-customer-reviews"] });
    }
    return data.review;
  };

  return {
    ...query,
    reviews: query.data ?? INITIAL_REVIEWS,
    submitReview,
  };
}

export async function fetchAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  try {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    if (!res.ok) return { authenticated: false };
    return (await res.json()) as { authenticated: boolean; email?: string };
  } catch {
    return { authenticated: false };
  }
}

export async function fetchSuperAdminSession(): Promise<{
  authenticated: boolean;
  email?: string;
}> {
  try {
    const res = await fetch("/api/superadmin/session", { credentials: "include" });
    if (!res.ok) return { authenticated: false };
    return (await res.json()) as { authenticated: boolean; email?: string };
  } catch {
    return { authenticated: false };
  }
}

export async function fetchSuperAdminAnalytics(): Promise<AnalyticsSummary | null> {
  const res = await fetch("/api/superadmin/analytics", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { analytics?: AnalyticsSummary };
  return data.analytics ?? null;
}
