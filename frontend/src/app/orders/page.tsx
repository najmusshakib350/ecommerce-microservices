import { OrderHistory } from '@/features/orders/components/order-history';

export const metadata = {
  title: 'Orders',
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Order history</h1>
      <OrderHistory />
    </div>
  );
}
