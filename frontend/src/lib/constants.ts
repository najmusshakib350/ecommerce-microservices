export const API_ROUTES = {
  users: '/users',
  products: '/products',
  orders: '/orders',
  health: '/health',
} as const;

export const STORAGE_KEYS = {
  authUser: 'ecommerce_auth_user',
  cart: 'ecommerce_cart',
} as const;

export const QUERY_KEYS = {
  products: ['products'] as const,
  product: (id: string) => ['products', id] as const,
  orders: (userId: string) => ['orders', userId] as const,
  users: ['users'] as const,
} as const;

export const REVALIDATE_SECONDS = 60;
