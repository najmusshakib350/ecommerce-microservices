import { notFound } from 'next/navigation';
import { ProductForm } from '@/features/products/components/product-form';
import { productsService } from '@/services';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: 'Edit product',
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  try {
    const product = await productsService.getByIdServer(id);
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-slate-900">Edit product image</h1>
        <ProductForm mode="edit" product={product} />
      </div>
    );
  } catch {
    notFound();
  }
}
