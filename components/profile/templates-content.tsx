'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCartStore } from '@/lib/store/cart-store';
import { deleteTemplate, useTemplate } from '@/lib/actions/template-actions';
import { toast } from 'sonner';
import { FileText, ShoppingCart, Trash2, Package } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  lastUsedAt: Date | null;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      sku: string;
      slug: string;
      retailPrice: number;
      images: { url: string }[];
    };
  }[];
}

interface TemplatesContentProps {
  templates: Template[];
}

export function TemplatesContent({ templates: initialTemplates }: TemplatesContentProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const addToCart = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleUseTemplate = async (template: Template) => {
    setProcessingId(template.id);

    // Add all items to cart
    template.items.forEach((item) => {
      addToCart({
        id: `${item.product.id}-${Date.now()}-${Math.random()}`,
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        price: item.product.retailPrice,
        image: item.product.images[0]?.url,
        maxStock: 999, // We don't have stock info here
        quantity: item.quantity,
      });
    });

    // Update last used
    await useTemplate(template.id);

    toast.success('Template added to cart', {
      description: `${template.items.length} items added`,
    });

    setProcessingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"?`)) return;

    setProcessingId(id);
    const result = await deleteTemplate(id);

    if (result.success) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success('Template deleted');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete template');
    }
    setProcessingId(null);
  };

  const getTotalPrice = (template: Template) => {
    return template.items.reduce(
      (sum, item) => sum + item.product.retailPrice * item.quantity,
      0
    );
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Create templates from your cart for quick reordering
        </p>
        <Button onClick={() => router.push('/')}>Browse Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template.id} className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{template.items.length} items</span>
                <span>•</span>
                <span>Total: ₱{formatPrice(getTotalPrice(template))}</span>
                {template.lastUsedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Last used: {new Date(template.lastUsedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleUseTemplate(template)}
                disabled={processingId === template.id}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDelete(template.id, template.name)}
                disabled={processingId === template.id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {template.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
              >
                <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium">Qty: {item.quantity}</p>
                  <p className="text-xs text-muted-foreground">
                    ₱{formatPrice(item.product.retailPrice * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
