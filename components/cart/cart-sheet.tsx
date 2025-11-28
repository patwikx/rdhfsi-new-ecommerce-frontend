'use client';

import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MinioImage } from '@/components/shared/minio-image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store/cart-store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const totalItems = mounted ? getTotalItems() : 0;
  const totalPrice = mounted ? getTotalPrice() : 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {mounted && totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-lg font-bold">
            Shopping Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Add some products to get started
            </p>
            <Button onClick={() => setOpen(false)}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                        {item.image && (
                          <MinioImage
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.name}</h4>
                        <p className="text-xs text-muted-foreground font-mono mb-3">SKU: {item.sku}</p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">₱{formatPrice(item.price)}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-2 text-sm font-medium border-x border-border min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Subtotal: <span className="font-semibold text-foreground">₱{formatPrice(item.price * item.quantity)}</span>
                      </p>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-destructive hover:text-destructive/80 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary - Fixed at bottom */}
            <div className="border-t border-border bg-muted/30 px-6 py-5">
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₱{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-xs">Calculated at checkout</span>
                </div>
                <div className="flex items-center justify-between text-xl font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span>₱{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    setOpen(false);
                    router.push('/checkout');
                  }}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
