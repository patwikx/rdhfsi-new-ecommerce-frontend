'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductQuantity from './product-quantity';
import AddToCartButton from './add-to-cart-button';

interface ProductAddToCartSectionProps {
  productId: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  maxStock: number;
}

export default function ProductAddToCartSection({
  productId,
  name,
  sku,
  price,
  image,
  maxStock,
}: ProductAddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border-t border-border pt-4 space-y-2">
      <div className="flex gap-2">
        <ProductQuantity
          min={1}
          max={maxStock}
          defaultValue={1}
          onChange={setQuantity}
        />
        <AddToCartButton
          productId={productId}
          name={name}
          sku={sku}
          price={price}
          image={image}
          maxStock={maxStock}
          quantity={quantity}
        />
      </div>
      <Button size="default" variant="outline" className="w-full">
        Request a Quote
      </Button>
    </div>
  );
}
