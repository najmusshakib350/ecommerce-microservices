export type Order = {
  id: string;
  userId: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderCreatedEvent = {
  orderId: string;
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};
