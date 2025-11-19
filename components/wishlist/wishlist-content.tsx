'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string;
  retailPrice: number;
  compareAtPrice: number | null;
  isOnSale: boolean;
  averageRating: number | null;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;
  image: string | null;
  availableQty: number;
  notes: string | null;
  addedAt: Date;
}

interface WishlistContentProps {
  items: WishlistItem[];
}

export function WishlistContent({ items: initialItems }: WishlistContentProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const addToCart = useCartStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: `${item.productId}-${Date.now()}`,
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      price: item.retailPrice,
      image: item.image || undefined,
      maxStock: item.availableQty,
      quantity: 1,
    });

    toast.success('Added to cart', {
      description: item.name,
    });
  };

  const handleRemove = (item: WishlistItem) => {
    removeFromWishlist(item.productId);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast.success('Removed from wishlist');
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    items.forEach((item) => {
      if (item.availableQty > 0) {
        addToCart({
          id: `${item.productId}-${Date.now()}-${addedCount}`,
          productId: item.productId,
          name: item.name,
          sku: item.sku,
          price: item.retailPrice,
          image: item.image || undefined,
          maxStock: item.availableQty,
          quantity: 1,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast.success(`Added ${addedCount} items to cart`);
    } else {
      toast.error('No items available to add');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Start adding products you love to your wishlist
        </p>
        <Button onClick={() => router.push('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleAddAllToCart} size="lg">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add All to Cart
        </Button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <Link href={`/product/${item.slug}`} className="block mb-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
                {item.isOnSale && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">SKU: {item.sku}</p>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-lg font-bold">₱{formatPrice(item.retailPrice)}</span>
                {item.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₱{formatPrice(item.compareAtPrice)}
                  </span>
                )}
              </div>

              {item.availableQty > 0 ? (
                <p className="text-xs text-green-600">In Stock ({item.availableQty})</p>
              ) : (
                <p className="text-xs text-red-600">Out of Stock</p>
              )}
            </Link>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleAddToCart(item)}
                disabled={item.availableQty === 0}
                className="flex-1"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add to Cart
              </Button>
              <Button
                onClick={() => handleRemove(item)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
