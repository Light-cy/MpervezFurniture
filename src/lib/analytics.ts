import type { WhatsAppClickSource, WhatsAppLeadEvent } from "@/lib/store-types";

const LOCAL_LEADS_KEY = "pf_wa_leads_cache_v1";

export interface TrackWhatsAppParams {
  source: WhatsAppClickSource;
  productId?: string;
  productName?: string;
  colourName?: string;
}

function getLocalLeads(): WhatsAppLeadEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_LEADS_KEY);
    return raw ? (JSON.parse(raw) as WhatsAppLeadEvent[]) : [];
  } catch {
    return [];
  }
}

function appendLocalLead(event: WhatsAppLeadEvent): void {
  if (typeof window === "undefined") return;
  try {
    const list = getLocalLeads();
    const updated = [event, ...list].slice(0, 200);
    window.localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
}

export function getCachedClientLeads(): WhatsAppLeadEvent[] {
  return getLocalLeads();
}

/**
 * Fires a non-blocking analytics beacon whenever a visitor clicks any WhatsApp
 * CTA button across the storefront. WhatsApp opens immediately without delay.
 */
export function trackWhatsAppClick(params: TrackWhatsAppParams): void {
  if (typeof window === "undefined") return;

  const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent || "");
  const device: "mobile" | "desktop" = isMobile ? "mobile" : "desktop";
  const path = window.location.pathname || "/";

  const payload = {
    source: params.source,
    productId: params.productId,
    productName: params.productName,
    colourName: params.colourName,
    device,
    path,
  };

  appendLocalLead({
    id: `wa-local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...payload,
  });

  const body = JSON.stringify(payload);

  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const queued = navigator.sendBeacon("/api/analytics/wa-click", blob);
      if (queued) return;
    }
  } catch {
    // Fallback to fetch with keepalive
  }

  try {
    void fetch("/api/analytics/wa-click", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Ignore network errors so WhatsApp navigation is never interrupted
  }
}
