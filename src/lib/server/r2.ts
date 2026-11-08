/**
 * Cloudflare R2 Media Storage Handler.
 *
 * Supports:
 * 1. Native Cloudflare R2 Worker binding (`env.R2_BUCKET`) for zero-egress edge storage.
 * 2. Local memory-backed edge media store fallback for instant local dev & preview testing,
 *    including HTTP Range header support so uploaded MP4 videos can seek and stream smoothly.
 */

interface R2BucketBinding {
  put: (
    key: string,
    value: ReadableStream | ArrayBuffer | Uint8Array,
    options?: { httpMetadata?: { contentType?: string; cacheControl?: string } },
  ) => Promise<unknown>;
  get: (key: string) => Promise<{
    body: ReadableStream;
    httpMetadata?: { contentType?: string };
    size: number;
  } | null>;
}

interface StoredMediaObject {
  bytes: Uint8Array;
  contentType: string;
  createdAt: number;
}

const memoryMediaStore = new Map<string, StoredMediaObject>();

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime", "video/ogg"]);

const MAX_IMAGE_BYTES = 12 * 1024 * 1024; // 12 MB
const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60 MB

function getR2Bucket(env: unknown): R2BucketBinding | null {
  if (env && typeof env === "object" && "R2_BUCKET" in env) {
    const candidate = (env as Record<string, unknown>)["R2_BUCKET"];
    if (candidate && typeof candidate === "object" && "put" in candidate && "get" in candidate) {
      return candidate as R2BucketBinding;
    }
  }
  return null;
}

function getR2PublicDomain(env: unknown): string | null {
  if (env && typeof env === "object" && "R2_PUBLIC_URL" in env) {
    const val = (env as Record<string, unknown>)["R2_PUBLIC_URL"];
    if (typeof val === "string" && val.trim().length > 0) {
      return val.trim().replace(/\/+$/, "");
    }
  }
  if (typeof process !== "undefined" && process.env?.["R2_PUBLIC_URL"]) {
    return process.env["R2_PUBLIC_URL"].trim().replace(/\/+$/, "");
  }
  return null;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function inferContentType(name: string, explicitType?: string): string {
  if (explicitType && explicitType !== "application/octet-stream") {
    return explicitType;
  }
  const lower = name.toLowerCase();
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return explicitType || "application/octet-stream";
}

export async function handleMediaUpload(request: Request, env: unknown): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = formData.get("folder");
    const folder = folderRaw === "products" ? "products" : "reviews";

    if (!file || typeof file === "string" || typeof file.arrayBuffer !== "function") {
      return Response.json({ error: "No media file provided." }, { status: 400 });
    }

    const fileName = "name" in file && typeof file.name === "string" ? file.name : "upload.bin";
    const contentType = inferContentType(fileName, file.type);
    const isImage = ALLOWED_IMAGE_TYPES.has(contentType) || contentType.startsWith("image/");
    const isVideo = ALLOWED_VIDEO_TYPES.has(contentType) || contentType.startsWith("video/");

    if (!isImage && !isVideo) {
      return Response.json(
        { error: "Unsupported file format. Please upload JPG, PNG, WEBP, MP4, MOV, or WEBM." },
        { status: 400 },
      );
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return Response.json(
        {
          error: isVideo
            ? "Video exceeds the 60 MB maximum size limit."
            : "Image exceeds the 12 MB maximum size limit.",
        },
        { status: 400 },
      );
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const cleanName = sanitizeFileName(file.name || (isVideo ? "video.mp4" : "image.jpg"));
    const objectKey = `${folder}/${uniqueId}-${cleanName}`;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const bucket = getR2Bucket(env);
    const publicDomain = getR2PublicDomain(env);

    if (bucket) {
      await bucket.put(objectKey, bytes, {
        httpMetadata: {
          contentType,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    } else {
      memoryMediaStore.set(objectKey, {
        bytes,
        contentType,
        createdAt: Date.now(),
      });
    }

    const url = publicDomain ? `${publicDomain}/${objectKey}` : `/api/media/file/${objectKey}`;

    return Response.json({
      url,
      key: objectKey,
      mediaType: isVideo ? "video" : "image",
      size: file.size,
      storage: bucket ? "cloudflare-r2" : "r2-local-bucket",
    });
  } catch (err) {
    console.error("R2 upload error:", err);
    return Response.json({ error: "Failed to upload media file." }, { status: 500 });
  }
}

export async function handleMediaServe(
  request: Request,
  objectKey: string,
  env: unknown,
): Promise<Response> {
  const bucket = getR2Bucket(env);
  if (bucket) {
    const obj = await bucket.get(objectKey);
    if (!obj) {
      return new Response("Media not found", { status: 404 });
    }
    return new Response(obj.body, {
      status: 200,
      headers: {
        "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
        "accept-ranges": "bytes",
      },
    });
  }

  const stored = memoryMediaStore.get(objectKey);
  if (!stored) {
    return new Response("Media not found", { status: 404 });
  }

  const total = stored.bytes.byteLength;
  const rangeHeader = request.headers.get("range");

  if (rangeHeader && rangeHeader.startsWith("bytes=")) {
    const parts = rangeHeader.replace("bytes=", "").split("-");
    const start = parseInt(parts[0] ?? "0", 10) || 0;
    const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
    const clampedEnd = Math.min(end, total - 1);

    if (start >= 0 && start <= clampedEnd) {
      const chunk = stored.bytes.subarray(start, clampedEnd + 1);
      return new Response(
        chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) as ArrayBuffer,
        {
          status: 206,
          headers: {
            "content-type": stored.contentType,
            "content-range": `bytes ${start}-${clampedEnd}/${total}`,
            "content-length": String(chunk.byteLength),
            "accept-ranges": "bytes",
            "cache-control": "public, max-age=31536000, immutable",
          },
        },
      );
    }
  }

  return new Response(
    stored.bytes.buffer.slice(
      stored.bytes.byteOffset,
      stored.bytes.byteOffset + stored.bytes.byteLength,
    ) as ArrayBuffer,
    {
      status: 200,
      headers: {
        "content-type": stored.contentType,
        "content-length": String(total),
        "accept-ranges": "bytes",
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  );
}
