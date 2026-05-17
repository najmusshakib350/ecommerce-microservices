'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Spinner } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCart } from '@/features/cart/hooks/use-cart';
import { useCreateOrder } from '@/hooks/use-orders';
import { formatCurrency } from '@/utils/format';

export function CheckoutForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Please sign in to complete your purchase.</p>
        <Link href="/auth/login" className="mt-4 inline-block">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block">
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError(null);
    try {
      for (const item of items) {
        await createOrder.mutateAsync({
          userId: user.id,
          productId: item.productId,
          quantity: item.quantity,
        });
      }
      clearCart();
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Shipping to</h2>
        <p className="mt-2 text-slate-700">{user.name ?? 'Customer'}</p>
        <p className="text-slate-600">{user.email}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Order items</h2>
        <ul className="mt-4 space-y-2">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between text-sm text-slate-700">
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-slate-100 pt-4 font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </p>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <Button
          className="mt-6"
          fullWidth
          size="lg"
          disabled={createOrder.isPending}
          onClick={handlePlaceOrder}
        >
          {createOrder.isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="h-5 w-5 border-white border-t-transparent" />
              Placing order…
            </span>
          ) : (
            'Place order'
          )}
        </Button>
      </div>
    </div>
  );
}
