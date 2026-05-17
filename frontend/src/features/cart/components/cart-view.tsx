'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { useCart } from '@/features/cart/hooks/use-cart';
import { formatCurrency } from '@/utils/format';

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <h2 className="text-lg font-semibold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-600">Add products from the catalog to get started.</p>
        <Link href="/products" className="mt-6 inline-block">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-semibold text-slate-900">{item.title}</h3>
              <p className="text-sm text-slate-600">{formatCurrency(item.price)} each</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.productId, Number(e.target.value))
                }
                className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                aria-label={`Quantity for ${item.title}`}
              />
              <p className="min-w-[80px] font-semibold text-slate-900">
                {formatCurrency(item.price * item.quantity)}
              </p>
              <Button variant="ghost" size="sm" onClick={() => removeItem(item.productId)}>
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <p className="mt-4 flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </p>
        <Link href="/checkout" className="mt-6 block">
          <Button fullWidth size="lg">
            Proceed to checkout
          </Button>
        </Link>
      </aside>
    </div>
  );
}
