import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (product: Product) => void;
  remove: (productId: number) => void;
  changeQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const formatPrice = (price: number): string => {
  return Math.round(price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';
};

export const calcProductVND = (price: number): number => {
  return Math.round(price * PRICE_MULTIPLIER);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (product: Product) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.product.id === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, { product, quantity: 1 }] });
        }
      },

      remove: (productId: number) => {
        set({
          items: get().items.filter((i) => i.product.id !== productId),
        });
      },

      changeQty: (productId: number, delta: number) => {
        const currentItems = get().items;
        const itemIndex = currentItems.findIndex((i) => i.product.id === productId);

        if (itemIndex > -1) {
          const newQty = currentItems[itemIndex].quantity + delta;
          if (newQty <= 0) {
            set({
              items: currentItems.filter((i) => i.product.id !== productId),
            });
          } else {
            const updatedItems = [...currentItems];
            updatedItems[itemIndex].quantity = newQty;
            set({ items: updatedItems });
          }
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => {
          const unitVnd = calcProductVND(item.product.price);
          return sum + unitVnd * item.quantity;
        }, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useCartStore;
