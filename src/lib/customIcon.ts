export const CUSTOM_ICON_KEY = "tsubuyakiBattlerIcon_v1";

const ICON_SIZE = 96;
const JPEG_QUALITY = 0.85;

export function loadCustomIcon(): string | null {
  try {
    return localStorage.getItem(CUSTOM_ICON_KEY);
  } catch {
    // ignore
  }
  return null;
}

export function saveCustomIcon(dataUrl: string) {
  try {
    localStorage.setItem(CUSTOM_ICON_KEY, dataUrl);
  } catch {
    // ignore
  }
}

export function clearCustomIcon(): void {
  try {
    localStorage.removeItem(CUSTOM_ICON_KEY);
  } catch {
    // ignore
  }
}

export function fileToIconDataUrl(file: File): Promise<string> {
  if (!file.type || !file.type.startsWith("image/")) {
    return Promise.reject(new Error("not an image file"));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("failed to read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("failed to decode image"));
      img.onload = () => {
        try {
          const side = Math.min(img.naturalWidth, img.naturalHeight);
          if (!side || !Number.isFinite(side)) {
            reject(new Error("invalid image dimensions"));
            return;
          }
          const sx = (img.naturalWidth - side) / 2;
          const sy = (img.naturalHeight - side) / 2;
          const canvas = document.createElement("canvas");
          canvas.width = ICON_SIZE;
          canvas.height = ICON_SIZE;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("canvas not supported"));
            return;
          }
          ctx.drawImage(img, sx, sy, side, side, 0, 0, ICON_SIZE, ICON_SIZE);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        } catch (err) {
          reject(err instanceof Error ? err : new Error("failed to process image"));
        }
      };
      img.src = typeof reader.result === "string" ? reader.result : "";
    };
    reader.readAsDataURL(file);
  });
}
