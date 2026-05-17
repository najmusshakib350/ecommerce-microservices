export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  httpTimeoutMs: parseInt(process.env.HTTP_TIMEOUT_MS ?? '5000', 10),
  services: {
    user: process.env.USER_SERVICE_URL ?? 'http://localhost:3001',
    product: process.env.PRODUCT_SERVICE_URL ?? 'http://localhost:3002',
    order: process.env.ORDER_SERVICE_URL ?? 'http://localhost:3003',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  },
});
