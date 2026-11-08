import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import pfLogo from "@/assets/pf-logo.png";
import { fetchAdminSession } from "@/lib/store-client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [
      { title: "Admin Login | Pervez Furniture" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@pervezfurniture.pk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchAdminSession().then((s) => {
      if (s.authenticated) {
        void navigate({ to: "/admin" });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as {
        authenticated?: boolean;
        error?: string;
      };

      if (!res.ok || !data.authenticated) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      await navigate({ to: "/admin" });
    } catch {
      setError("Network error while signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[78vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-3xl border border-gold/30 bg-night-card p-6 shadow-2xl sm:p-8">
        <div className="text-center">
          <img
            src={pfLogo}
            alt="Pervez Furniture logo"
            width={128}
            height={128}
            className="mx-auto h-14 w-14 object-contain"
          />
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold text-gold">
            <ShieldCheck className="h-3.5 w-3.5" /> Showroom Management Portal
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold text-cream sm:text-3xl">
            Admin Sign In
          </h1>
          <p className="mt-1 text-xs text-cream-muted">
            Manage catalogue products, WhatsApp customer leads, and showroom settings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-royal/60 bg-royal/15 px-4 py-3 text-xs font-medium text-cream">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-cream">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-cream">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mt-1.5 w-full rounded-xl border border-border bg-night px-3.5 py-2.5 text-sm text-cream focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-3 text-sm disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {loading ? "Signing In..." : "Sign In to Admin Panel"}
          </button>
        </form>

        {/* Quick fill helper for local preview/testing */}
        <div className="mt-5 rounded-2xl border border-border bg-night p-3.5 text-xs text-cream-muted">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium text-cream">
              <KeyRound className="h-3.5 w-3.5 text-gold" /> Default Local Credentials
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@pervezfurniture.pk");
                setPassword("PervezAdmin2026!");
              }}
              className="font-semibold text-gold hover:underline"
            >
              Auto-fill
            </button>
          </div>
          <p className="mt-1 text-[11px]">
            Protected by HMAC-SHA256 HttpOnly cookie sessions & brute-force rate limiting.
          </p>
        </div>

        <div className="mt-5 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cream-muted hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
