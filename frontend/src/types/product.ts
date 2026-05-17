export type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductPayload = {
  title: string;
  price: number;
  stock: number;
};
