import Link from 'next/link';
import { ProductImage } from '@/components/shared/product-image';
import { Badge } from '@/components/ui';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      <ProductImage
        title={product.title}
        imageUrl={product.imageUrl}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <header className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold text-slate-900 group-hover:text-indigo-600">
            {product.title}
          </h3>
          {outOfStock ? <Badge variant="danger">Out of stock</Badge> : null}
        </header>
        <p className="text-lg font-bold text-indigo-600">{formatCurrency(product.price)}</p>
        <p className="mt-auto text-sm text-slate-500">{product.stock} in stock</p>
      </div>
    </Link>
  );
}
