const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000";

export function resolveProductImageUrl(
  imageUrl?: string | null,
): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${MEDIA_BASE.replace(/\/$/, "")}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}
