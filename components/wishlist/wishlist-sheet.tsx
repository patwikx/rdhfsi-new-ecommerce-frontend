'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { useCartStore } from '@/lib/store/cart-store';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function WishlistSheet() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, getTotalItems } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalItems = mounted ? getTotalItems() : 0;

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: `${item.productId}-${Date.now()}`,
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      price: item.price,
      image: item.image,
      maxStock: 999, // Default max stock
      quantity: 1,
    });

    // Remove from wishlist after adding to cart
    removeItem(item.productId);

    toast.success('Added to cart', {
      description: `${item.name} moved from wishlist to cart`,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <Heart className="w-5 h-5" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-lg font-bold">
            Wishlist ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Save your favorite products for later
            </p>
            <Button onClick={() => setOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <a 
                        href={`/product/${item.slug}`}
                        className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border hover:opacity-80 transition-opacity"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </a>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <a 
                          href={`/product/${item.slug}`}
                          className="font-semibold text-sm line-clamp-2 mb-1 hover:text-primary transition-colors block"
                        >
                          {item.name}
                        </a>
                        <p className="text-xs text-muted-foreground font-mono mb-2">SKU: {item.sku}</p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">₱{formatPrice(item.price)}</p>
                          {!item.inStock && (
                            <span className="text-xs text-destructive font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                      <button
                        onClick={() => {
                          removeItem(item.productId);
                          toast.info('Removed from wishlist');
                        }}
                        className="text-destructive hover:text-destructive/80 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="border-t border-border bg-muted/30 px-6 py-5">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
