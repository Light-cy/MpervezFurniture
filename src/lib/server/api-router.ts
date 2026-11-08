import { buildDefaultColours, type Category, type Product } from "@/data/products";
import {
  buildClearSessionCookie,
  buildSessionCookie,
  checkRateLimit,
  clearFailedLogins,
  getAdminCredentials,
  getSuperAdminCredentials,
  recordFailedLogin,
  signSessionToken,
  timingSafeEqualString,
  verifyAdminRequest,
  verifySuperAdminRequest,
} from "./auth";
import { handleMediaServe, handleMediaUpload } from "./r2";
import {
  createReviewItem,
  deleteProductItem,
  getAnalyticsSummary,
  getProductsList,
  getReviewsList,
  getShowroomSettings,
  recordWhatsAppLead,
  updateShowroomSettings,
  upsertProductItem,
} from "./store";
import type { ReviewMedia, ShowroomSettings, WhatsAppClickSource } from "@/lib/store-types";

function detectDevice(request: Request, explicitDevice?: string): "mobile" | "desktop" {
  if (explicitDevice === "mobile" || explicitDevice === "desktop") return explicitDevice;
  const ua = request.headers.get("user-agent") ?? "";
  return /android|iphone|ipad|ipod|mobile/i.test(ua) ? "mobile" : "desktop";
}

function getClientIdentifier(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local-client"
  );
}

export async function handleApiRequest(request: Request, env: unknown): Promise<Response | null> {
  const url = new URL(request.url);
  const { pathname } = url;

  if (!pathname.startsWith("/api/")) {
    return null;
  }

  const method = request.method.toUpperCase();

  // 1. Cloudflare R2 Media Upload & Streaming
  if (pathname === "/api/media/upload" && method === "POST") {
    return handleMediaUpload(request, env);
  }

  if (pathname.startsWith("/api/media/file/") && (method === "GET" || method === "HEAD")) {
    const objectKey = decodeURIComponent(pathname.slice("/api/media/file/".length));
    return handleMediaServe(request, objectKey, env);
  }

  // 2A. Showroom Admin Authentication (/admin — Products Management only)
  if (pathname === "/api/admin/session" && method === "GET") {
    const session = await verifyAdminRequest(request, env);
    if (!session) {
      return Response.json({ authenticated: false });
    }
    return Response.json({ authenticated: true, email: session.email, role: session.role });
  }

  if (pathname === "/api/admin/login" && method === "POST") {
    const clientKey = `admin:${getClientIdentifier(request)}`;
    const rate = checkRateLimit(clientKey);
    if (!rate.allowed) {
      return Response.json(
        {
          error: `Too many failed login attempts. Please wait ${rate.retryAfterSeconds ?? 60} seconds.`,
        },
        { status: 429 },
      );
    }

    let body: { email?: string; password?: string } = {};
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const emailInput = (body.email ?? "").trim().toLowerCase();
    const passwordInput = body.password ?? "";
    const creds = getAdminCredentials(env);

    const [emailMatches, passwordMatches] = await Promise.all([
      timingSafeEqualString(emailInput, creds.email.toLowerCase()),
      timingSafeEqualString(passwordInput, creds.password),
    ]);

    if (!emailMatches || !passwordMatches) {
      recordFailedLogin(clientKey);
      return Response.json({ error: "Invalid admin email or password." }, { status: 401 });
    }

    clearFailedLogins(clientKey);
    const token = await signSessionToken(creds.email, creds.secret, "admin");
    const cookie = buildSessionCookie(token, request, "admin");

    return new Response(
      JSON.stringify({ authenticated: true, email: creds.email, role: "admin" }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie": cookie,
        },
      },
    );
  }

  if (pathname === "/api/admin/logout" && method === "POST") {
    const cookie = buildClearSessionCookie(request, "admin");
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": cookie,
      },
    });
  }

  // 2B. Private SuperAdmin Authentication (/superadmin — WhatsApp Leads & R2 Settings)
  if (pathname === "/api/superadmin/session" && method === "GET") {
    const session = await verifySuperAdminRequest(request, env);
    if (!session) {
      return Response.json({ authenticated: false });
    }
    return Response.json({ authenticated: true, email: session.email, role: "superadmin" });
  }

  if (pathname === "/api/superadmin/login" && method === "POST") {
    const clientKey = `superadmin:${getClientIdentifier(request)}`;
    const rate = checkRateLimit(clientKey);
    if (!rate.allowed) {
      return Response.json(
        {
          error: `Too many failed login attempts. Please wait ${rate.retryAfterSeconds ?? 60} seconds.`,
        },
        { status: 429 },
      );
    }

    let body: { email?: string; password?: string } = {};
    try {
      body = (await request.json()) as { email?: string; password?: string };
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const emailInput = (body.email ?? "").trim().toLowerCase();
    const passwordInput = body.password ?? "";
    const creds = getSuperAdminCredentials(env);

    const [emailMatches, passwordMatches] = await Promise.all([
      timingSafeEqualString(emailInput, creds.email.toLowerCase()),
      timingSafeEqualString(passwordInput, creds.password),
    ]);

    if (!emailMatches || !passwordMatches) {
      recordFailedLogin(clientKey);
      return Response.json({ error: "Invalid superadmin credentials." }, { status: 401 });
    }

    clearFailedLogins(clientKey);
    const token = await signSessionToken(creds.email, creds.secret, "superadmin");
    const cookie = buildSessionCookie(token, request, "superadmin");

    return new Response(
      JSON.stringify({ authenticated: true, email: creds.email, role: "superadmin" }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
          "set-cookie": cookie,
        },
      },
    );
  }

  if (pathname === "/api/superadmin/logout" && method === "POST") {
    const cookie = buildClearSessionCookie(request, "superadmin");
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": cookie,
      },
    });
  }

  // 3. Products Catalogue API
  if (pathname === "/api/products" && method === "GET") {
    return Response.json({
      products: getProductsList(),
      settings: getShowroomSettings(),
    });
  }

  if (pathname === "/api/admin/products" && method === "POST") {
    const session = await verifyAdminRequest(request, env);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const payload = (await request.json()) as Partial<Product>;
      if (!payload.name || !payload.category || typeof payload.price !== "number") {
        return Response.json(
          { error: "Product name, category, and price are required." },
          { status: 400 },
        );
      }

      const id =
        payload.id?.trim() ||
        payload.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
          "-" +
          Date.now().toString(36).slice(-4);

      const images =
        Array.isArray(payload.images) && payload.images.length > 0
          ? payload.images
          : ["/og-image.jpg"];

      const colours =
        Array.isArray(payload.colours) && payload.colours.length > 0
          ? payload.colours
          : buildDefaultColours(images[0]!, images[1]);

      const product: Product = {
        id,
        name: payload.name.trim(),
        category: payload.category as Category,
        price: Math.max(0, Math.round(payload.price)),
        ...(payload.badge ? { badge: payload.badge } : {}),
        images,
        colours,
        specs: payload.specs ?? {
          Material: "Seasoned Sheesham Wood",
          Warranty: "5 years",
        },
        description: payload.description?.trim() || "",
        bestSeller: Boolean(payload.bestSeller),
      };

      const saved = upsertProductItem(product);
      return Response.json({ product: saved, products: getProductsList() });
    } catch {
      return Response.json({ error: "Failed to save product." }, { status: 400 });
    }
  }

  if (pathname.startsWith("/api/admin/products/") && method === "DELETE") {
    const session = await verifyAdminRequest(request, env);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const id = decodeURIComponent(pathname.slice("/api/admin/products/".length));
    deleteProductItem(id);
    return Response.json({ ok: true, products: getProductsList() });
  }

  // 4. Customer Reviews API (Direct publish, no admin approval needed)
  if (pathname === "/api/reviews" && method === "GET") {
    const productId = url.searchParams.get("productId") || undefined;
    return Response.json({ reviews: getReviewsList(productId) });
  }

  if (pathname === "/api/reviews" && method === "POST") {
    try {
      const body = (await request.json()) as {
        name?: string;
        area?: string;
        rating?: number;
        text?: string;
        productId?: string;
        media?: ReviewMedia[];
      };

      if (!body.name?.trim()) {
        return Response.json({ error: "Please enter your name." }, { status: 400 });
      }
      if (!body.area?.trim()) {
        return Response.json({ error: "Please enter your area or city." }, { status: 400 });
      }
      if (!body.text?.trim()) {
        return Response.json({ error: "Please write your review message." }, { status: 400 });
      }

      const created = createReviewItem({
        name: body.name,
        area: body.area,
        rating: body.rating ?? 5,
        text: body.text,
        productId: body.productId,
        media: body.media,
      });

      return Response.json({ review: created, reviews: getReviewsList() }, { status: 201 });
    } catch {
      return Response.json({ error: "Invalid review submission." }, { status: 400 });
    }
  }

  // 5. WhatsApp Leads & Conversion Analytics API (Restricted to SuperAdmin)
  if (pathname === "/api/analytics/wa-click" && method === "POST") {
    try {
      const text = await request.text();
      const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
      const validSources = new Set<WhatsAppClickSource>([
        "product_page",
        "floating_fab",
        "navbar",
        "mobile_tab",
        "footer",
        "contact_page",
        "about_page",
        "hero_banner",
      ]);
      const rawSource = String(data["source"] ?? "floating_fab") as WhatsAppClickSource;
      const source: WhatsAppClickSource = validSources.has(rawSource) ? rawSource : "floating_fab";

      const event = recordWhatsAppLead({
        source,
        productId: typeof data["productId"] === "string" ? data["productId"] : undefined,
        productName: typeof data["productName"] === "string" ? data["productName"] : undefined,
        colourName: typeof data["colourName"] === "string" ? data["colourName"] : undefined,
        device: detectDevice(
          request,
          typeof data["device"] === "string" ? data["device"] : undefined,
        ),
        path: typeof data["path"] === "string" ? data["path"] : "/",
      });

      return Response.json({ ok: true, event });
    } catch {
      return Response.json({ ok: false }, { status: 400 });
    }
  }

  if (
    (pathname === "/api/superadmin/analytics" || pathname === "/api/admin/analytics") &&
    method === "GET"
  ) {
    const session = await verifySuperAdminRequest(request, env);
    if (!session) {
      return Response.json({ error: "SuperAdmin access required" }, { status: 401 });
    }
    return Response.json({ analytics: getAnalyticsSummary() });
  }

  // 6. Showroom & R2 Settings API (Read public, Write restricted to SuperAdmin)
  if (pathname === "/api/settings" && method === "GET") {
    return Response.json({ settings: getShowroomSettings() });
  }

  if (
    (pathname === "/api/superadmin/settings" || pathname === "/api/admin/settings") &&
    method === "PUT"
  ) {
    const session = await verifySuperAdminRequest(request, env);
    if (!session) {
      return Response.json({ error: "SuperAdmin access required" }, { status: 401 });
    }
    try {
      const body = (await request.json()) as Record<string, unknown>;
      const partialSettings: Partial<ShowroomSettings> = {};
      if (typeof body["announcementEnabled"] === "boolean") {
        partialSettings.announcementEnabled = body["announcementEnabled"];
      }
      if (typeof body["announcementText"] === "string") {
        partialSettings.announcementText = body["announcementText"];
      }
      if (typeof body["showroomNotice"] === "string") {
        partialSettings.showroomNotice = body["showroomNotice"];
      }
      if (typeof body["r2PublicDomain"] === "string") {
        partialSettings.r2PublicDomain = body["r2PublicDomain"];
      }
      const updated = updateShowroomSettings(partialSettings);
      return Response.json({ settings: updated });
    } catch {
      return Response.json({ error: "Invalid settings payload." }, { status: 400 });
    }
  }

  return Response.json({ error: "API route not found" }, { status: 404 });
}
