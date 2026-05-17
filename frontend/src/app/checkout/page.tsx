import { CheckoutForm } from '@/features/orders/components/checkout-form';

export const metadata = {
  title: 'Checkout',
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
