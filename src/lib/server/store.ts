import { PRODUCTS, type Product } from "@/data/products";
import { REVIEWS } from "@/data/reviews";
import type {
  AnalyticsSummary,
  ProductLeadStat,
  ReviewItem,
  ShowroomSettings,
  WhatsAppClickSource,
  WhatsAppLeadEvent,
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

function createInitialWhatsAppLeads(): WhatsAppLeadEvent[] {
  const now = Date.now();
  const hour = 3600 * 1000;
  const day = 24 * hour;

  const samples: Array<{
    offsetMs: number;
    source: WhatsAppClickSource;
    productId?: string;
    colourName?: string;
    device: "mobile" | "desktop";
    path: string;
  }> = [
    {
      offsetMs: 1.5 * hour,
      source: "product_page",
      productId: "shahi-carved-king-bed-set",
      colourName: "Royal Gold & Cream",
      device: "mobile",
      path: "/product/shahi-carved-king-bed-set",
    },
    {
      offsetMs: 3.2 * hour,
      source: "product_page",
      productId: "shahi-royal-sofa-7",
      colourName: "Royal Crimson",
      device: "mobile",
      path: "/product/shahi-royal-sofa-7",
    },
    {
      offsetMs: 5 * hour,
      source: "floating_fab",
      device: "mobile",
      path: "/products",
    },
    {
      offsetMs: 7.5 * hour,
      source: "product_page",
      productId: "noor-mahal-rosewood-bed-set",
      colourName: "Deep Walnut",
      device: "desktop",
      path: "/product/noor-mahal-rosewood-bed-set",
    },
    {
      offsetMs: 18 * hour,
      source: "navbar",
      device: "desktop",
      path: "/",
    },
    {
      offsetMs: 1.4 * day,
      source: "product_page",
      productId: "shahi-carved-king-bed",
      colourName: "Antique Gold",
      device: "mobile",
      path: "/product/shahi-carved-king-bed",
    },
    {
      offsetMs: 2.1 * day,
      source: "product_page",
      productId: "royal-marble-dining-8",
      colourName: "Carrara White & Gold",
      device: "mobile",
      path: "/product/royal-marble-dining-8",
    },
    {
      offsetMs: 2.8 * day,
      source: "hero_banner",
      device: "mobile",
      path: "/",
    },
    {
      offsetMs: 3.5 * day,
      source: "product_page",
      productId: "shahi-carved-king-bed-set",
      colourName: "Emerald Velvet",
      device: "mobile",
      path: "/product/shahi-carved-king-bed-set",
    },
    {
      offsetMs: 4.2 * day,
      source: "contact_page",
      device: "mobile",
      path: "/contact",
    },
    {
      offsetMs: 5.5 * day,
      source: "product_page",
      productId: "grand-chesterfield-sofa",
      colourName: "Cognac Tan",
      device: "desktop",
      path: "/product/grand-chesterfield-sofa",
    },
    {
      offsetMs: 8.1 * day,
      source: "mobile_tab",
      device: "mobile",
      path: "/reviews",
    },
  ];

  return samples.map((s, idx) => {
    const prod = s.productId ? PRODUCTS.find((p) => p.id === s.productId) : undefined;
    return {
      id: `wa-seed-${idx + 1}`,
      timestamp: new Date(now - s.offsetMs).toISOString(),
      source: s.source,
      productId: s.productId,
      productName: prod?.name,
      colourName: s.colourName,
      device: s.device,
      path: s.path,
    };
  });
}

let productsState: Product[] = structuredClone(PRODUCTS);
let reviewsState: ReviewItem[] = structuredClone(INITIAL_REVIEWS);
let leadsState: WhatsAppLeadEvent[] = createInitialWhatsAppLeads();
let settingsState: ShowroomSettings = {
  announcementEnabled: true,
  announcementText:
    "Factory Rates Furniture Available · Custom Sizes & Fabrics · 5-Year Solid Sheesham Warranty",
  showroomNotice:
    "Visit our Margzar Scheme Showroom in Lahore — Open All Days 12:00 PM to 10:00 PM",
  r2PublicDomain: "https://media.pervezfurniture.example",
};

export function getProductsList(): Product[] {
  return productsState;
}

export function getProductById(id: string): Product | undefined {
  return productsState.find((p) => p.id === id);
}

export function upsertProductItem(product: Product): Product {
  const index = productsState.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    productsState[index] = product;
  } else {
    productsState = [product, ...productsState];
  }
  return product;
}

export function deleteProductItem(id: string): boolean {
  const before = productsState.length;
  productsState = productsState.filter((p) => p.id !== id);
  return productsState.length < before;
}

export function getReviewsList(productId?: string): ReviewItem[] {
  if (!productId) return reviewsState;
  return reviewsState.filter((r) => r.productId === productId);
}

export function createReviewItem(input: {
  name: string;
  area: string;
  rating: number;
  text: string;
  productId?: string | undefined;
  media?: ReviewItem["media"] | undefined;
}): ReviewItem {
  const matchedProduct = input.productId
    ? productsState.find((p) => p.id === input.productId)
    : undefined;

  const newReview: ReviewItem = {
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    area: input.area.trim(),
    rating: Math.max(1, Math.min(5, Math.round(Number(input.rating) || 5))),
    text: input.text.trim(),
    productId: input.productId || undefined,
    productName: matchedProduct?.name,
    media: Array.isArray(input.media) ? input.media : [],
    createdAt: new Date().toISOString(),
  };

  reviewsState = [newReview, ...reviewsState];
  return newReview;
}

export function recordWhatsAppLead(input: {
  source: WhatsAppClickSource;
  productId?: string | undefined;
  productName?: string | undefined;
  colourName?: string | undefined;
  device: "mobile" | "desktop";
  path: string;
}): WhatsAppLeadEvent {
  const matchedProduct = input.productId
    ? productsState.find((p) => p.id === input.productId)
    : undefined;

  const event: WhatsAppLeadEvent = {
    id: `wa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    source: input.source,
    productId: input.productId,
    productName: input.productName || matchedProduct?.name,
    colourName: input.colourName,
    device: input.device,
    path: input.path || "/",
  };

  leadsState = [event, ...leadsState].slice(0, 500);
  return event;
}

export function getAnalyticsSummary(): AnalyticsSummary {
  const now = Date.now();
  const dayMs = 24 * 3600 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const todayMs = startOfToday.getTime();

  let clicksToday = 0;
  let clicksLast7Days = 0;
  let clicksLast30Days = 0;
  let mobileClicks = 0;
  let desktopClicks = 0;

  const bySource: Record<WhatsAppClickSource, number> = {
    product_page: 0,
    floating_fab: 0,
    navbar: 0,
    mobile_tab: 0,
    footer: 0,
    contact_page: 0,
    about_page: 0,
    hero_banner: 0,
  };

  const productMap = new Map<string, ProductLeadStat>();

  for (const ev of leadsState) {
    const t = new Date(ev.timestamp).getTime();
    if (t >= todayMs) clicksToday += 1;
    if (now - t <= 7 * dayMs) clicksLast7Days += 1;
    if (now - t <= 30 * dayMs) clicksLast30Days += 1;

    if (ev.device === "mobile") mobileClicks += 1;
    else desktopClicks += 1;

    if (ev.source in bySource) {
      bySource[ev.source] += 1;
    }

    if (ev.productId) {
      const existing = productMap.get(ev.productId);
      const prodName =
        ev.productName || productsState.find((p) => p.id === ev.productId)?.name || ev.productId;
      if (existing) {
        existing.clicks += 1;
        if (ev.timestamp > existing.lastClickedAt) {
          existing.lastClickedAt = ev.timestamp;
        }
      } else {
        productMap.set(ev.productId, {
          productId: ev.productId,
          productName: prodName,
          clicks: 1,
          lastClickedAt: ev.timestamp,
        });
      }
    }
  }

  const topProducts = Array.from(productMap.values()).sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks: leadsState.length,
    clicksToday,
    clicksLast7Days,
    clicksLast30Days,
    mobileClicks,
    desktopClicks,
    bySource,
    topProducts,
    recentEvents: leadsState.slice(0, 50),
  };
}

export function getShowroomSettings(): ShowroomSettings {
  return settingsState;
}

export function updateShowroomSettings(partial: Partial<ShowroomSettings>): ShowroomSettings {
  settingsState = {
    ...settingsState,
    ...partial,
  };
  return settingsState;
}
