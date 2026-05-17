import { ProductCard } from '@/components/shared/product-card';
import { productsService } from '@/services';

export const revalidate = 60;

export const metadata = {
  title: 'Products',
};

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof productsService.listServer>> = [];
  try {
    products = await productsService.listServer();
  } catch {
    products = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All products</h1>
        <p className="mt-2 text-slate-600">
          Static generation with ISR — revalidates every 60 seconds
        </p>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No products available.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
