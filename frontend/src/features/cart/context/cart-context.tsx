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
import type { CartItem, Product } from '@/types';
import { readStorage, writeStorage } from '@/utils/storage';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = readStorage<CartItem[]>(STORAGE_KEYS.cart);
    if (stored) setItems(stored);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeStorage(STORAGE_KEYS.cart, next);
  }, []);

  const addItem = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        let next: CartItem[];

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, product.stock);
          next = prev.map((i) =>
            i.productId === product.id ? { ...i, quantity: newQty } : i,
          );
        } else {
          next = [
            ...prev,
            {
              productId: product.id,
              title: product.title,
              price: product.price,
              stock: product.stock,
              quantity: Math.min(quantity, product.stock),
            },
          ];
        }

        writeStorage(STORAGE_KEYS.cart, next);
        return next;
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setItems((prev) => {
        const next = prev
          .map((item) => {
            if (item.productId !== productId) return item;
            const qty = Math.max(1, Math.min(quantity, item.stock));
            return { ...item, quantity: qty };
          })
          .filter((item) => item.quantity > 0);
        writeStorage(STORAGE_KEYS.cart, next);
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.productId !== productId);
        writeStorage(STORAGE_KEYS.cart, next);
        return next;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
}
