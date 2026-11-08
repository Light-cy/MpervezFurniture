import type { Category, Product, ProductColour } from "@/data/products";
import type { Review, ReviewMedia } from "@/data/reviews";

export type { Category, Product, ProductColour, Review, ReviewMedia };

export interface ReviewItem extends Omit<Review, "productId"> {
  id: string;
  createdAt: string;
  productId?: string | undefined;
  productName?: string | undefined;
}

export type WhatsAppClickSource =
  | "product_page"
  | "floating_fab"
  | "navbar"
  | "mobile_tab"
  | "footer"
  | "contact_page"
  | "about_page"
  | "hero_banner";

export interface WhatsAppLeadEvent {
  id: string;
  timestamp: string;
  source: WhatsAppClickSource;
  productId?: string | undefined;
  productName?: string | undefined;
  colourName?: string | undefined;
  device: "mobile" | "desktop";
  path: string;
}

export interface ProductLeadStat {
  productId: string;
  productName: string;
  clicks: number;
  lastClickedAt: string;
}

export interface AnalyticsSummary {
  totalClicks: number;
  clicksToday: number;
  clicksLast7Days: number;
  clicksLast30Days: number;
  mobileClicks: number;
  desktopClicks: number;
  bySource: Record<WhatsAppClickSource, number>;
  topProducts: ProductLeadStat[];
  recentEvents: WhatsAppLeadEvent[];
}

export interface ShowroomSettings {
  announcementEnabled: boolean;
  announcementText: string;
  showroomNotice: string;
  r2PublicDomain: string;
}
