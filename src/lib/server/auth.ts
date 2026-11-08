/**
 * Option 1: Direct Secure Session Authentication (Web Crypto HMAC + HttpOnly Cookies).
 *
 * Supports two isolated privilege levels:
 * 1. `admin` (`/admin`) — Showroom staff access, restricted strictly to Catalogue Products CRUD.
 * 2. `superadmin` (`/superadmin`) — Private owner/developer access for WhatsApp Leads Analytics
 *    and Showroom / Cloudflare R2 Settings.
 */

const ADMIN_COOKIE_NAME = "pf_admin_session";
const SUPERADMIN_COOKIE_NAME = "pf_superadmin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export type AuthRole = "admin" | "superadmin";

export interface SessionPayload {
  email: string;
  role: AuthRole;
  iat: number;
  exp: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();

function getEnvValue(env: unknown, key: string, fallback: string): string {
  if (env && typeof env === "object" && key in env) {
    const val = (env as Record<string, unknown>)[key];
    if (typeof val === "string" && val.length > 0) return val;
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
}

export function getAdminCredentials(env?: unknown) {
  return {
    email: getEnvValue(env, "ADMIN_EMAIL", "admin@pervezfurniture.pk"),
    password: getEnvValue(env, "ADMIN_PASSWORD", "PervezAdmin2026!"),
    secret: getEnvValue(env, "SESSION_SECRET", "pf-luxury-showroom-lahore-hmac-secret-key-2026-v1"),
  };
}

export function getSuperAdminCredentials(env?: unknown) {
  return {
    email: getEnvValue(env, "SUPERADMIN_EMAIL", "owner@pervezfurniture.pk"),
    password: getEnvValue(env, "SUPERADMIN_PASSWORD", "SuperAdmin2026!"),
    secret: getEnvValue(env, "SESSION_SECRET", "pf-luxury-showroom-lahore-hmac-secret-key-2026-v1"),
  };
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Constant-time string comparison via SHA-256 digests to prevent timing attacks. */
export async function timingSafeEqualString(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const viewA = new Uint8Array(hashA);
  const viewB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) {
    diff |= (viewA[i] ?? 0) ^ (viewB[i] ?? 0);
  }
  return diff === 0 && a.length === b.length;
}

export async function signSessionToken(
  email: string,
  secret: string,
  role: AuthRole = "admin",
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    email,
    role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoder = new TextEncoder();
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getHmacKey(secret);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const signatureB64 = toBase64Url(new Uint8Array(signatureBuffer));
  return `${payloadB64}.${signatureB64}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  expectedRole?: AuthRole,
): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [payloadB64, signatureB64] = parts as [string, string];
    const key = await getHmacKey(secret);
    const encoder = new TextEncoder();
    const signatureBytes = fromBase64Url(signatureB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      encoder.encode(payloadB64),
    );
    if (!valid) return null;

    const decoded = new TextDecoder().decode(fromBase64Url(payloadB64));
    const payload = JSON.parse(decoded) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) return null;
    if (!payload.email || (payload.role !== "admin" && payload.role !== "superadmin")) {
      return null;
    }
    if (expectedRole && payload.role !== expectedRole) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(val);
  }
  return out;
}

export async function verifyAdminRequest(
  request: Request,
  env?: unknown,
): Promise<SessionPayload | null> {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const { secret } = getAdminCredentials(env);
  const adminToken = cookies[ADMIN_COOKIE_NAME];
  if (adminToken) {
    const verified = await verifySessionToken(adminToken, secret, "admin");
    if (verified) return verified;
  }
  // Allow superadmin to also manage products if needed
  const superToken = cookies[SUPERADMIN_COOKIE_NAME];
  if (superToken) {
    return verifySessionToken(superToken, secret, "superadmin");
  }
  return null;
}

export async function verifySuperAdminRequest(
  request: Request,
  env?: unknown,
): Promise<SessionPayload | null> {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const token = cookies[SUPERADMIN_COOKIE_NAME];
  if (!token) return null;
  const { secret } = getSuperAdminCredentials(env);
  return verifySessionToken(token, secret, "superadmin");
}

export function buildSessionCookie(
  token: string,
  request: Request,
  role: AuthRole = "admin",
): string {
  const cookieName = role === "superadmin" ? SUPERADMIN_COOKIE_NAME : ADMIN_COOKIE_NAME;
  const isSecure = new URL(request.url).protocol === "https:";
  const parts = [
    `${cookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

export function buildClearSessionCookie(request: Request, role: AuthRole = "admin"): string {
  const cookieName = role === "superadmin" ? SUPERADMIN_COOKIE_NAME : ADMIN_COOKIE_NAME;
  const isSecure = new URL(request.url).protocol === "https:";
  const parts = [`${cookieName}=`, "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

export function checkRateLimit(clientKey: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const entry = loginAttempts.get(clientKey);
  if (!entry) return { allowed: true };

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }

  if (now - entry.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(clientKey);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(clientKey: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(clientKey);
  if (!entry || now - entry.firstAttemptAt > LOCKOUT_WINDOW_MS) {
    loginAttempts.set(clientKey, { attempts: 1, firstAttemptAt: now });
    return;
  }

  entry.attempts += 1;
  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_WINDOW_MS;
  }
}

export function clearFailedLogins(clientKey: string): void {
  loginAttempts.delete(clientKey);
}
