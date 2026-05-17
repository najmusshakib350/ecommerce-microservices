'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProductImage } from '@/components/shared/product-image';
import { Button } from '@/components/ui';
import { useCart } from '@/features/cart/hooks/use-cart';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="grid gap-10 lg:grid-cols-2">
      <ProductImage
        title={product.title}
        imageUrl={product.imageUrl}
        className="aspect-square w-full rounded-2xl"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />

      <div className="flex flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-indigo-600">In stock: {product.stock}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.title}</h1>
          <p className="mt-4 text-3xl font-bold text-indigo-600">
            {formatCurrency(product.price)}
          </p>
        </header>

        <Link
          href={`/products/${product.id}/edit`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Edit product image →
        </Link>

        {!outOfStock ? (
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-slate-700">
              Quantity
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, Math.min(Number(e.target.value), product.stock)),
                  )
                }
                className="ml-2 w-20 rounded-lg border border-slate-300 px-2 py-1"
              />
            </label>
            <Button onClick={handleAdd} size="lg">
              {added ? 'Added to cart!' : 'Add to cart'}
            </Button>
            <Link href="/cart">
              <Button variant="outline" size="lg">
                View cart
              </Button>
            </Link>
          </div>
        ) : (
          <p className="font-medium text-red-600">This product is out of stock.</p>
        )}
      </div>
    </section>
  );
}
