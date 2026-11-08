import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { handleApiRequest } from "@/lib/server/api-router";
import { signSessionToken, verifySessionToken } from "@/lib/server/auth";
import { routeTree } from "@/routeTree.gen";

describe("Admin Panel, SuperAdmin Control & Customer Reviews", () => {
  it("matches routes for /admin, /admin/login, /superadmin, /superadmin/login, and /reviews", () => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });

    expect(router.matchRoutes("/admin").at(-1)?.routeId).not.toBe(rootRouteId);
    expect(router.matchRoutes("/admin/login").at(-1)?.routeId).not.toBe(rootRouteId);
    expect(router.matchRoutes("/superadmin").at(-1)?.routeId).not.toBe(rootRouteId);
    expect(router.matchRoutes("/superadmin/login").at(-1)?.routeId).not.toBe(rootRouteId);
    expect(router.matchRoutes("/reviews").at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("signs and verifies Option 1 HMAC session tokens and enforces role isolation", async () => {
    const secret = "test-hmac-secret-2026";
    const adminToken = await signSessionToken("admin@pervezfurniture.pk", secret, "admin");
    const verifiedAdmin = await verifySessionToken(adminToken, secret, "admin");

    expect(verifiedAdmin).not.toBeNull();
    expect(verifiedAdmin?.email).toBe("admin@pervezfurniture.pk");
    expect(verifiedAdmin?.role).toBe("admin");

    // Admin token must NOT pass superadmin role check
    expect(await verifySessionToken(adminToken, secret, "superadmin")).toBeNull();

    const superToken = await signSessionToken("owner@pervezfurniture.pk", secret, "superadmin");
    expect((await verifySessionToken(superToken, secret, "superadmin"))?.role).toBe("superadmin");

    const tampered = `${adminToken}tampered`;
    expect(await verifySessionToken(tampered, secret)).toBeNull();
    expect(await verifySessionToken(adminToken, "wrong-secret")).toBeNull();
  });

  it("allows /admin to manage products while blocking access to /superadmin analytics & settings", async () => {
    // 1. Login as Showroom Admin (/api/admin/login)
    const loginRes = await handleApiRequest(
      new Request("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "admin@pervezfurniture.pk",
          password: "PervezAdmin2026!",
        }),
      }),
      {},
    );
    expect(loginRes?.status).toBe(200);
    const setCookie = loginRes?.headers.get("set-cookie") ?? "";
    expect(setCookie).toContain("pf_admin_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");

    const adminCookiePair = setCookie.split(";")[0]!;

    // 2. Verify Showroom Admin can create/update products
    const createProdRes = await handleApiRequest(
      new Request("http://localhost:3000/api/admin/products", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          cookie: adminCookiePair,
        },
        body: JSON.stringify({
          id: "test-royal-chinioti-bed",
          name: "Royal Chinioti King Bed",
          category: "beds",
          price: 215000,
          badge: "NEW",
          bestSeller: true,
          description: "Hand-carved sheesham bed.",
          images: ["/og-image.jpg"],
        }),
      }),
      {},
    );
    expect(createProdRes?.status).toBe(200);
    const createdProdData = (await createProdRes?.json()) as {
      product: { colours: Array<{ name: string }> };
    };
    expect(createdProdData.product.colours.map((c) => c.name)).toEqual([
      "Brown",
      "Black",
      "Grey",
      "Off-White",
    ]);

    // 3. Verify Showroom Admin cookie is BLOCKED from SuperAdmin analytics & settings
    const blockedAnalytics = await handleApiRequest(
      new Request("http://localhost:3000/api/superadmin/analytics", {
        headers: { cookie: adminCookiePair },
      }),
      {},
    );
    expect(blockedAnalytics?.status).toBe(401);
  });

  it("tracks customer WhatsApp click events and exposes them only to SuperAdmin", async () => {
    const clickRes = await handleApiRequest(
      new Request("http://localhost:3000/api/analytics/wa-click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "product_page",
          productId: "shahi-carved-king-bed",
          productName: "Shahi Carved King Bed",
          colourName: "Antique Gold",
          device: "mobile",
          path: "/product/shahi-carved-king-bed",
        }),
      }),
      {},
    );
    expect(clickRes?.status).toBe(200);

    // Login as SuperAdmin
    const superLogin = await handleApiRequest(
      new Request("http://localhost:3000/api/superadmin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "owner@pervezfurniture.pk",
          password: "SuperAdmin2026!",
        }),
      }),
      {},
    );
    expect(superLogin?.status).toBe(200);
    const superCookie = superLogin?.headers.get("set-cookie")?.split(";")[0] ?? "";
    expect(superCookie).toContain("pf_superadmin_session=");

    const analyticsRes = await handleApiRequest(
      new Request("http://localhost:3000/api/superadmin/analytics", {
        headers: { cookie: superCookie },
      }),
      {},
    );
    expect(analyticsRes?.status).toBe(200);
    const data = (await analyticsRes?.json()) as {
      analytics: {
        totalClicks: number;
        clicksToday: number;
        recentEvents: Array<{ productId?: string }>;
      };
    };
    expect(data.analytics.totalClicks).toBeGreaterThan(0);
    expect(data.analytics.clicksToday).toBeGreaterThan(0);
    expect(data.analytics.recentEvents[0]?.productId).toBe("shahi-carved-king-bed");
  });

  it("publishes customer reviews with required name and R2 video/image media directly", async () => {
    const badRes = await handleApiRequest(
      new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "",
          area: "Gulberg, Lahore",
          rating: 5,
          text: "Great sofa!",
        }),
      }),
      {},
    );
    expect(badRes?.status).toBe(400);

    const createRes = await handleApiRequest(
      new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Hamza Sheikh",
          area: "DHA Phase 6, Lahore",
          rating: 5,
          text: "Bought the Shahi bed set. Finish and carving are unmatched!",
          productId: "shahi-carved-king-bed",
          media: [
            { type: "video", url: "/api/media/file/reviews/sample-video.mp4" },
            { type: "image", url: "/api/media/file/reviews/sample-photo.jpg" },
          ],
        }),
      }),
      {},
    );
    expect(createRes?.status).toBe(201);

    const prodRevRes = await handleApiRequest(
      new Request("http://localhost:3000/api/reviews?productId=shahi-carved-king-bed"),
      {},
    );
    const prodRevData = (await prodRevRes?.json()) as {
      reviews: Array<{ name: string; media: Array<{ type: string }> }>;
    };
    expect(prodRevData.reviews.some((r) => r.name === "Hamza Sheikh")).toBe(true);
  });

  it("uploads video media to R2 handler and streams partial byte ranges (HTTP 206)", async () => {
    const videoBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const file = new File([videoBytes], "customer-review.mp4", { type: "video/mp4" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "reviews");

    const uploadRes = await handleApiRequest(
      new Request("http://localhost:3000/api/media/upload", {
        method: "POST",
        body: formData,
      }),
      {},
    );
    expect(uploadRes?.status).toBe(200);
    const uploaded = (await uploadRes?.json()) as {
      url: string;
      mediaType: string;
    };
    expect(uploaded.mediaType).toBe("video");
    expect(uploaded.url).toContain("/api/media/file/reviews/");

    const rangeRes = await handleApiRequest(
      new Request(`http://localhost:3000${uploaded.url}`, {
        headers: { range: "bytes=0-3" },
      }),
      {},
    );
    expect(rangeRes?.status).toBe(206);
    expect(rangeRes?.headers.get("content-range")).toBe("bytes 0-3/12");
    const chunk = new Uint8Array(await rangeRes!.arrayBuffer());
    expect(Array.from(chunk)).toEqual([0, 1, 2, 3]);
  });
});
