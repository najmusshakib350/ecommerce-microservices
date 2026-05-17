import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/features/products/components/product-detail-client';
import { productsService } from '@/services';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { id } = await params;
    const product = await productsService.getByIdServer(id);
    return { title: product.title };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await productsService.getByIdServer(id);
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ProductDetailClient product={product} />
      </div>
    );
  } catch {
    notFound();
  }
}
