import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Cloud,
  ExternalLink,
  Laptop,
  LogOut,
  RefreshCw,
  Settings,
  ShieldAlert,
  Smartphone,
  Star,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  fetchSuperAdminAnalytics,
  fetchSuperAdminSession,
  useCustomerReviews,
  useShowroomSettings,
} from "@/lib/store-client";
import type { AnalyticsSummary, ShowroomSettings, WhatsAppClickSource } from "@/lib/store-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/superadmin/")({
  component: SuperAdminDashboardPage,
  head: () => ({
    meta: [
      { title: "SuperAdmin — Leads & R2 Control | Pervez Furniture" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type SuperTab = "leads" | "settings";

const SOURCE_LABELS: Record<WhatsAppClickSource, string> = {
  product_page: "Product Details Order Button",
  floating_fab: "Floating WhatsApp Button",
  navbar: "Top Navigation Bar",
  hero_banner: "Homepage Hero Banner",
  contact_page: "Contact Us Page",
  about_page: "About Us Page",
  mobile_tab: "Mobile Bottom Tab Bar",
  footer: "Website Footer",
};

function formatRelativeTime(iso: string): string {
  const diffSec = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function SuperAdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { reviews } = useCustomerReviews();
  const { data: settings } = useShowroomSettings();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [ownerEmail, setOwnerEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<SuperTab>("leads");
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<ShowroomSettings>(settings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const loadAnalytics = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchSuperAdminAnalytics();
      if (data) setAnalytics(data);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    void fetchSuperAdminSession().then((session) => {
      if (!mounted) return;
      if (!session.authenticated) {
        void navigate({ to: "/superadmin/login" });
        return;
      }
      setOwnerEmail(session.email ?? "owner@pervezfurniture.pk");
      setCheckingAuth(false);
      void loadAnalytics();
    });
    return () => {
      mounted = false;
    };
  }, [navigate, loadAnalytics]);

  const handleLogout = async () => {
    await fetch("/api/superadmin/logout", { method: "POST", credentials: "include" });
    await navigate({ to: "/superadmin/login" });
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSavedMsg(false);
    try {
      const res = await fetch("/api/superadmin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const data = (await res.json()) as { settings?: ShowroomSettings };
        if (data.settings) {
          queryClient.setQueryData(["pf-showroom-settings"], data.settings);
        }
        setSettingsSavedMsg(true);
        setTimeout(() => setSettingsSavedMsg(false), 3000);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="mx-auto flex min-h-[65vh] w-full max-w-[1536px] items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="mt-3 text-sm text-cream-muted">Verifying SuperAdmin access...</p>
        </div>
      </div>
    );
  }

  const totalClicks = analytics?.totalClicks ?? 0;
  const mobilePct =
    totalClicks > 0 ? Math.round(((analytics?.mobileClicks ?? 0) / totalClicks) * 100) : 75;
  const desktopPct = 100 - mobilePct;

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-10">
      {/* Top SuperAdmin Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-gold/40 bg-night-card p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-royal/50 bg-royal/20 px-3 py-0.5 text-xs font-semibold text-gold">
              <ShieldAlert className="h-3.5 w-3.5" /> Private SuperAdmin
            </span>
            <span className="text-xs text-cream-muted">{ownerEmail}</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-cream sm:text-3xl">
            WhatsApp Leads & R2 Control Center
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => void loadAnalytics()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night px-4 py-2 text-xs font-semibold text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
            Refresh Stats
          </button>

          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-night px-4 py-2 text-xs font-semibold text-cream-muted transition-colors hover:border-gold hover:text-gold"
          >
            Products Admin
          </Link>

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

      {/* Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm",
            activeTab === "leads"
              ? "border-gold bg-gold text-night shadow-sm shadow-gold/25"
              : "border-border bg-night-card text-cream-muted hover:border-gold/50 hover:text-cream",
          )}
        >
          <BarChart3 className="h-4 w-4" />
          WhatsApp Leads ({analytics?.totalClicks ?? 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm",
            activeTab === "settings"
              ? "border-gold bg-gold text-night shadow-sm shadow-gold/25"
              : "border-border bg-night-card text-cream-muted hover:border-gold/50 hover:text-cream",
          )}
        >
          <Settings className="h-4 w-4" />
          Showroom & R2 Settings
        </button>
      </div>

      {/* TAB 1: WHATSAPP LEADS & ANALYTICS */}
      {activeTab === "leads" && (
        <div className="mt-6 space-y-6">
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-gold/30 bg-night-card p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-cream-muted">
                <span>WhatsApp Clicks Today</span>
                <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-cream">
                {analytics?.clicksToday ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-gold">Live inquiries today</p>
            </div>

            <div className="rounded-2xl border border-border bg-night-card p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-cream-muted">
                <span>Past 7 Days</span>
                <TrendingUp className="h-4 w-4 text-gold" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-cream">
                {analytics?.clicksLast7Days ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-cream-muted">Weekly WhatsApp leads</p>
            </div>

            <div className="rounded-2xl border border-border bg-night-card p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-cream-muted">
                <span>Past 30 Days</span>
                <BarChart3 className="h-4 w-4 text-gold" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-cream">
                {analytics?.clicksLast30Days ?? 0}
              </p>
              <p className="mt-1 text-[11px] text-cream-muted">Monthly WhatsApp leads</p>
            </div>

            <div className="rounded-2xl border border-border bg-night-card p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-cream-muted">
                <span>Customer Reviews</span>
                <Star className="h-4 w-4 text-gold" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-cream">{reviews.length}</p>
              <p className="mt-1 text-[11px] text-cream-muted">
                {reviews.filter((r) => r.media.some((m) => m.type === "video")).length} with video
              </p>
            </div>
          </div>

          {/* Top Inquired Products & Source Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Products by WhatsApp Leads */}
            <div className="rounded-3xl border border-border bg-night-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-cream">
                  Most Inquired Furniture Products
                </h2>
                <span className="text-xs text-gold">By WhatsApp Clicks</span>
              </div>

              <div className="mt-4 space-y-3">
                {(analytics?.topProducts ?? []).length === 0 ? (
                  <p className="py-6 text-center text-xs text-cream-muted">
                    No product-specific WhatsApp clicks recorded yet.
                  </p>
                ) : (
                  analytics?.topProducts.slice(0, 6).map((item, idx) => {
                    const maxClicks = analytics.topProducts[0]?.clicks || 1;
                    const barWidth = Math.max(12, Math.round((item.clicks / maxClicks) * 100));
                    return (
                      <div
                        key={item.productId}
                        className="rounded-2xl border border-border bg-night p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-semibold text-cream">
                            #{idx + 1} · {item.productName}
                          </span>
                          <span className="shrink-0 rounded-full bg-whatsapp/15 px-2.5 py-0.5 font-bold text-whatsapp">
                            {item.clicks} click{item.clicks === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-night-card">
                          <div
                            className="h-full rounded-full bg-gold"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] text-cream-muted">
                          <span>Last inquiry: {formatRelativeTime(item.lastClickedAt)}</span>
                          <Link
                            to="/product/$id"
                            params={{ id: item.productId }}
                            className="text-gold hover:underline"
                          >
                            View Product →
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Source & Device Breakdown */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-night-card p-5 sm:p-6">
                <h2 className="font-display text-lg font-bold text-cream">
                  Leads by Button / Page Source
                </h2>
                <div className="mt-4 space-y-2.5">
                  {analytics &&
                    (Object.entries(analytics.bySource) as Array<[WhatsAppClickSource, number]>)
                      .sort((a, b) => b[1] - a[1])
                      .map(([sourceKey, count]) => (
                        <div
                          key={sourceKey}
                          className="flex items-center justify-between rounded-xl border border-border bg-night px-3.5 py-2.5 text-xs"
                        >
                          <span className="text-cream">{SOURCE_LABELS[sourceKey]}</span>
                          <span className="font-bold text-gold">{count}</span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-night-card p-5 sm:p-6">
                <h2 className="font-display text-lg font-bold text-cream">Customer Device Split</h2>
                <div className="mt-4 flex items-center justify-between text-xs text-cream">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Smartphone className="h-4 w-4 text-gold" /> Mobile ({mobilePct}%)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Laptop className="h-4 w-4 text-cream-muted" /> Desktop ({desktopPct}%)
                  </span>
                </div>
                <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-night">
                  <div className="bg-gold" style={{ width: `${mobilePct}%` }} />
                  <div className="bg-border" style={{ width: `${desktopPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent WhatsApp Customer Clicks Feed */}
          <div className="rounded-3xl border border-border bg-night-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-cream">
                  Recent Customer WhatsApp Clicks
                </h2>
                <p className="text-xs text-cream-muted">
                  Real-time log of visitors clicking through to your showroom WhatsApp
                </p>
              </div>
              <span className="text-xs font-semibold text-gold">
                Showing latest {analytics?.recentEvents.length ?? 0} leads
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-cream-muted">
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">Source</th>
                    <th className="pb-3 font-semibold">Product / Colour</th>
                    <th className="pb-3 font-semibold">Device</th>
                    <th className="pb-3 font-semibold">Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {(analytics?.recentEvents ?? []).map((ev) => (
                    <tr key={ev.id} className="text-cream">
                      <td className="py-3 pr-4 whitespace-nowrap text-cream-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gold" />
                          {formatRelativeTime(ev.timestamp)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold">
                          {SOURCE_LABELS[ev.source] ?? ev.source}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {ev.productName ? (
                          <div>
                            <span className="font-semibold text-cream">{ev.productName}</span>
                            {ev.colourName && (
                              <span className="ml-1.5 text-[11px] text-cream-muted">
                                ({ev.colourName})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-cream-muted">General Showroom Inquiry</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap capitalize text-cream-muted">
                        {ev.device}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-cream-muted">{ev.path}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHOWROOM SETTINGS & CLOUDFLARE R2 */}
      {activeTab === "settings" && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <form
            onSubmit={handleSaveSettings}
            className="space-y-5 rounded-3xl border border-border bg-night-card p-5 sm:p-6 lg:col-span-2"
          >
            <h2 className="font-display text-xl font-bold text-cream">
              Showroom Banner & Announcements
            </h2>

            {settingsSavedMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/15 px-4 py-3 text-xs font-semibold text-gold">
                <CheckCircle2 className="h-4 w-4" /> Showroom settings updated on live storefront!
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-night p-4">
              <div>
                <span className="block text-sm font-semibold text-cream">
                  Show Top Announcement Bar
                </span>
                <span className="text-xs text-cream-muted">
                  Displays above the navigation bar on every storefront page
                </span>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.announcementEnabled}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    announcementEnabled: e.target.checked,
                  }))
                }
                className="h-5 w-5 accent-gold"
              />
            </label>

            <div>
              <label
                htmlFor="announcement-text-input"
                className="block text-xs font-semibold text-cream"
              >
                Announcement Bar Text
              </label>
              <input
                id="announcement-text-input"
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    announcementText: e.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="showroom-notice-input"
                className="block text-xs font-semibold text-cream"
              >
                Showroom Timings / Special Notice
              </label>
              <input
                id="showroom-notice-input"
                type="text"
                value={settingsForm.showroomNotice}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    showroomNotice: e.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="r2-domain-input" className="block text-xs font-semibold text-cream">
                Cloudflare R2 Public Media Domain
              </label>
              <input
                id="r2-domain-input"
                type="text"
                value={settingsForm.r2PublicDomain}
                onChange={(e) =>
                  setSettingsForm((prev) => ({
                    ...prev,
                    r2PublicDomain: e.target.value,
                  }))
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="btn-gold px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {savingSettings ? "Saving..." : "Save Showroom Settings"}
            </button>
          </form>

          {/* Cloudflare R2 Status Card */}
          <div className="rounded-3xl border border-gold/30 bg-night-card p-5 sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/30 bg-gold/15 text-gold">
              <Cloud className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-cream">
              Cloudflare R2 Media Engine
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-cream-muted">
              Customer review videos (MP4/MOV) and high-resolution furniture photos are served via
              Cloudflare R2 with zero egress bandwidth charges and byte-range streaming.
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-cream">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Zero Egress Video Streaming
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Direct Customer Review Uploads
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> HTTP 206 Byte-Range Video Seeking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-gold" /> Isolated SuperAdmin Cookie Auth
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
