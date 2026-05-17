'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/shared/empty-state';
import { Badge, Spinner } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency, formatDate } from '@/utils/format';

export function OrderHistory() {
  const { user } = useAuth();
  const { data: orders, isLoading, error } = useOrders(user?.id);

  if (!user) {
    return (
      <EmptyState
        title="Sign in required"
        description="Log in to view your order history."
        actionLabel="Sign in"
        actionHref="/auth/login"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error.message}
      </p>
    );
  }

  if (!orders?.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Place your first order from the catalog."
        actionLabel="Shop now"
        actionHref="/products"
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)}</p>
              <p className="mt-1 text-sm text-slate-600">{formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={order.status === 'PENDING' ? 'warning' : 'success'}>
              {order.status}
            </Badge>
          </div>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Product</dt>
              <dd className="font-medium text-slate-900">{order.productId}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Quantity</dt>
              <dd className="font-medium text-slate-900">{order.quantity}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Unit price</dt>
              <dd className="font-medium text-slate-900">{formatCurrency(order.unitPrice)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Total</dt>
              <dd className="font-semibold text-indigo-600">
                {formatCurrency(order.totalPrice)}
              </dd>
            </div>
          </dl>
          <Link
            href={`/products/${order.productId}`}
            className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View product →
          </Link>
        </article>
      ))}
    </div>
  );
}
