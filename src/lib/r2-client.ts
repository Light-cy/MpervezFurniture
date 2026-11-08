export interface UploadedMediaResult {
  url: string;
  key: string;
  mediaType: "image" | "video";
  size: number;
  storage: string;
}

/**
 * Uploads an image or video file to Cloudflare R2 (via `/api/media/upload`)
 * while reporting real-time upload percentage (`0` to `100`).
 */
export function uploadMediaToR2(
  file: File,
  folder: "reviews" | "products",
  onProgress?: (percent: number) => void,
): Promise<UploadedMediaResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media/upload", true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const pct = Math.min(99, Math.round((event.loaded / event.total) * 100));
          onProgress(pct);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText || "{}") as UploadedMediaResult & {
          error?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && data.url) {
          onProgress?.(100);
          resolve(data);
        } else {
          reject(new Error(data.error || "Upload failed. Please try again."));
        }
      } catch {
        reject(new Error("Unexpected response from upload server."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading file to Cloudflare R2."));
    };

    xhr.send(formData);
  });
}
