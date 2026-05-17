import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui";
import { productsService } from "@/services";

export const revalidate = 60;

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof productsService.listServer>> = [];
  try {
    products = await productsService.listServer();
  } catch {
    products = [];
  }
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Discover products built for modern living.
            </h1>
            <p className="mt-4 text-lg text-indigo-100">
              ShopVerse connects to your microservices stack — users, products,
              and orders — through a unified API gateway.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-indigo-700 hover:bg-indigo-50"
                >
                  Browse catalog
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Featured products
            </h2>
            <p className="mt-1 text-slate-600">
              Server-rendered from product-service via gateway
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No products yet. Start product-service and add items via the API.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
