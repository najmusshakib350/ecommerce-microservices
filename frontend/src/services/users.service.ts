import { API_ROUTES } from '@/lib/constants';
import { apiClient } from '@/lib/api-client';
import { serverFetch } from '@/lib/server-fetch';
import type { CreateUserPayload, UpdateUserPayload, User } from '@/types';

export const usersService = {
  list(): Promise<User[]> {
    return apiClient.get<User[]>(API_ROUTES.users).then((res) => res.data);
  },

  listServer(): Promise<User[]> {
    return serverFetch<User[]>(API_ROUTES.users);
  },

  getById(id: string): Promise<User> {
    return apiClient.get<User>(`${API_ROUTES.users}/${id}`).then((res) => res.data);
  },

  create(payload: CreateUserPayload): Promise<User> {
    return apiClient.post<User>(API_ROUTES.users, payload).then((res) => res.data);
  },

  update(id: string, payload: UpdateUserPayload): Promise<User> {
    return apiClient
      .patch<User>(`${API_ROUTES.users}/${id}`, payload)
      .then((res) => res.data);
  },

  findByEmail(email: string): Promise<User | null> {
    return this.list().then((users) => users.find((u) => u.email === email) ?? null);
  },
};
