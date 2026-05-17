'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { usersService } from '@/services';
import type { CreateUserPayload, User } from '@/types';
import { readStorage, removeStorage, writeStorage } from '@/utils/storage';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (payload: CreateUserPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStorage<User>(STORAGE_KEYS.authUser);
    setUser(stored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string) => {
    const found = await usersService.findByEmail(email.trim().toLowerCase());
    if (!found) {
      throw new Error('No account found with this email. Please register first.');
    }
    writeStorage(STORAGE_KEYS.authUser, found);
    setUser(found);
  }, []);

  const register = useCallback(async (payload: CreateUserPayload) => {
    const created = await usersService.create({
      email: payload.email.trim().toLowerCase(),
      name: payload.name?.trim(),
    });
    writeStorage(STORAGE_KEYS.authUser, created);
    setUser(created);
  }, []);

  const logout = useCallback(() => {
    removeStorage(STORAGE_KEYS.authUser);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
