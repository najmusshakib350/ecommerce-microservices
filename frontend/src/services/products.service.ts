import { API_ROUTES, REVALIDATE_SECONDS } from '@/lib/constants';
import { apiClient } from '@/lib/api-client';
import { serverFetch } from '@/lib/server-fetch';
import type { CreateProductPayload, Product } from '@/types';

export type CreateProductWithImageInput = CreateProductPayload & {
  image: File;
};

export const productsService = {
  list(): Promise<Product[]> {
    return apiClient.get<Product[]>(API_ROUTES.products).then((res) => res.data);
  },

  listServer(): Promise<Product[]> {
    return serverFetch<Product[]>(API_ROUTES.products, {
      revalidate: REVALIDATE_SECONDS,
      tags: ['products'],
    });
  },

  getById(id: string): Promise<Product> {
    return apiClient
      .get<Product>(`${API_ROUTES.products}/${id}`)
      .then((res) => res.data);
  },

  getByIdServer(id: string): Promise<Product> {
    return serverFetch<Product>(`${API_ROUTES.products}/${id}`, {
      revalidate: REVALIDATE_SECONDS,
      tags: ['products', id],
    });
  },

  createWithImage(input: CreateProductWithImageInput): Promise<Product> {
    const form = new FormData();
    form.append('title', input.title);
    form.append('price', String(input.price));
    form.append('stock', String(input.stock));
    form.append('image', input.image);

    return apiClient
      .post<Product>(`${API_ROUTES.products}/with-image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },

  updateImage(id: string, image: File): Promise<Product> {
    const form = new FormData();
    form.append('image', image);

    return apiClient
      .patch<Product>(`${API_ROUTES.products}/${id}/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
