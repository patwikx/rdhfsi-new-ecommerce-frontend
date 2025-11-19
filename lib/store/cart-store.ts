import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  maxStock: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Update quantity if item exists
          const newQuantity = Math.min(
            existingItem.quantity + (item.quantity || 1),
            item.maxStock
          );
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [
              ...items,
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.productId === productId);
        
        if (!item) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const newQuantity = Math.min(quantity, item.maxStock);
        set({
          items: items.map((i) =>
            i.productId === productId ? { ...i, quantity: newQuantity } : i
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
