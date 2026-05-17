export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  email: string;
  name?: string;
};

export type UpdateUserPayload = {
  email?: string;
  name?: string;
};
