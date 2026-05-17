'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/constants';
import { ordersService } from '@/services';
import type { CreateOrderPayload } from '@/types';

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.orders(userId ?? ''),
    queryFn: () => ordersService.listByUser(userId!),
    enabled: Boolean(userId),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.create(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.orders(variables.userId),
      });
    },
  });
}
