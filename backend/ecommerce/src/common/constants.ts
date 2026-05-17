export const SERVICE_NAMES = {
  user: 'user-service',
  product: 'product-service',
  order: 'order-service',
} as const;

export const RABBITMQ_EXCHANGES = {
  fanout: 'ecommerce.fanout',
} as const;

export const GATEWAY_FANOUT_QUEUE = 'gateway.order.created.fanout.queue';
