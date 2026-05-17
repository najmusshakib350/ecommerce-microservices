import { ProductForm } from '@/features/products/components/product-form';

export const metadata = {
  title: 'Add product',
};

export default function NewProductPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Add product</h1>
      <ProductForm mode="create" />
    </section>
  );
}
