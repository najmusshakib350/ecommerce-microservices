import { CartView } from '@/features/cart/components/cart-view';

export const metadata = {
  title: 'Cart',
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Shopping cart</h1>
      <CartView />
    </div>
  );
}
