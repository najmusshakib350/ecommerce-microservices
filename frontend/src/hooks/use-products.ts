'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import { productsService } from '@/services';

export function useProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.products,
    queryFn: () => productsService.list(),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  });
}
