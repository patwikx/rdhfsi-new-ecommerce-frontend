import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuotationItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
  maxStock?: number;
}

interface QuotationStore {
  items: QuotationItem[];
  addItem: (item: Omit<QuotationItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearItems: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useQuotationStore = create<QuotationStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.productId === productId) {
              // Check if quantity exceeds maxStock
              const maxQty = item.maxStock !== undefined ? item.maxStock : quantity;
              const newQuantity = Math.min(quantity, maxQty);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
        });
      },

      clearItems: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'quotation-storage',
    }
  )
);
