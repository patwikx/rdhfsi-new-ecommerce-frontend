import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  slug: string;
  inStock: boolean;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const exists = items.find((i) => i.productId === item.productId);

        if (!exists) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
