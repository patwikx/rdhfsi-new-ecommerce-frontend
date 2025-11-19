'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  maxStock: number;
  quantity: number;
}

export default function AddToCartButton({
  productId,
  name,
  sku,
  price,
  image,
  maxStock,
  quantity,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      id: `${productId}-${Date.now()}`,
      productId,
      name,
      sku,
      price,
      image,
      maxStock,
      quantity,
    });

    toast.success('Added to cart', {
      description: `${quantity} x ${name}`,
    });

    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Button
      size="lg"
      className="flex-1 gap-2"
      onClick={handleAddToCart}
      disabled={isAdding}
    >
      <ShoppingCart className="w-4 h-4" />
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}
