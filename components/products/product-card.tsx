'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { useWishlistStore } from '@/lib/store/wishlist-store';
import { toast } from 'sonner';
import type { ProductWithDetails } from '@/app/actions/products';

interface ProductCardProps {
  product: ProductWithDetails;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const totalStock = product.inventories.reduce((sum, inv) => sum + inv.availableQty, 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (totalStock === 0) return;
    
    setIsAdding(true);
    
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.retailPrice,
      image: primaryImage?.url,
      maxStock: totalStock,
      quantity,
    });

    toast.success('Added to cart', {
      description: `${quantity} x ${product.name}`,
    });

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1); // Reset quantity after adding
    }, 500);
  };

  const incrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < totalStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist', {
        description: product.name,
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.retailPrice,
        image: primaryImage?.url,
        slug: product.slug,
        inStock: totalStock > 0,
      });
      toast.success('Added to wishlist', {
        description: product.name,
      });
    }
  };

  return (
    <a 
      href={`/product/${product.slug}`}
      className="group cursor-pointer bg-card border border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-sm block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {primaryImage?.url ? (
          <img 
            src={primaryImage.url} 
            alt={primaryImage.altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Package className="w-16 h-16 text-muted-foreground/40" />
          </div>
        )}
        
        {/* Sale Badge */}
        {product.compareAtPrice && Number(product.compareAtPrice) > product.retailPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            SALE
          </div>
        )}
        
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-muted-foreground hover:text-red-500'
            }`}
          />
        </button>
      </div>
      
      <div className="p-3 space-y-2">
        <div>
          <p className="text-[10px] text-muted-foreground font-mono mb-1">SKU: {product.sku}</p>
          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight mb-2">
            {product.name}
          </h4>
          
          <div className="mb-2">
            <span className="inline-block bg-muted/50 rounded-md px-2 py-1">
              <span className="text-lg font-bold whitespace-nowrap">
                ₱{formatPrice(product.retailPrice)}
                {product.baseUom && <span className="text-xs text-muted-foreground ml-1 lowercase">/{product.baseUom}</span>}
              </span>
            </span>
            {product.bulkPrice && (
              <p className="text-[10px] text-primary font-medium whitespace-nowrap mt-1">
                ₱{formatPrice(product.bulkPrice)} for {product.moq}+
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{product.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-muted-foreground">({product.reviewCount})</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-green-600 dark:text-green-400 font-medium">
            {totalStock} in stock
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          {/* Quantity Selector */}
          {totalStock > 0 && (
            <div className="flex items-center border border-border rounded-lg">
              <button
                onClick={decrementQty}
                disabled={quantity <= 1}
                className="px-2 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <span className="text-xs">−</span>
              </button>
              <span className="px-2 text-xs font-medium border-x border-border min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQty}
                disabled={quantity >= totalStock}
                className="px-2 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <span className="text-xs">+</span>
              </button>
            </div>
          )}
          
          {/* Action Buttons */}
          <Button 
            size="sm" 
            className="flex-1 h-8 text-xs gap-1" 
            onClick={handleAddToCart}
            disabled={isAdding || totalStock === 0}
          >
            <ShoppingCart className="w-3 h-3" />
            {isAdding ? 'Adding...' : totalStock === 0 ? 'Out of Stock' : 'Add'}
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs px-2">Quote</Button>
        </div>
      </div>
    </a>
  );
}
