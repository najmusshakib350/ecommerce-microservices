import Image from "next/image";
import { resolveProductImageUrl } from "@/lib/product-image";
import { cn } from "@/utils/cn";

type ProductImageProps = {
  title: string;
  imageUrl?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function ProductImage({
  title,
  imageUrl,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: ProductImageProps) {
  // const src = resolveProductImageUrl(imageUrl);
  const src = imageUrl;

  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100",
          className,
        )}
      >
        <span className="text-4xl font-bold text-indigo-200">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-slate-100", className)}>
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}
