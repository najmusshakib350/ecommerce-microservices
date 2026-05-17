import { API_ROUTES } from '@/lib/constants';
import { apiClient } from '@/lib/api-client';
import type { CreateOrderPayload, Order } from '@/types';

export const ordersService = {
  list(): Promise<Order[]> {
    return apiClient.get<Order[]>(API_ROUTES.orders).then((res) => res.data);
  },

  create(payload: CreateOrderPayload): Promise<Order> {
    return apiClient.post<Order>(API_ROUTES.orders, payload).then((res) => res.data);
  },

  listByUser(userId: string): Promise<Order[]> {
    return this.list().then((orders) =>
      orders.filter((order) => order.userId === userId),
    );
  },
};
