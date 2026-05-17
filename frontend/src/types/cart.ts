export type CartItem = {
  productId: string;
  title: string;
  price: number;
  stock: number;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};
