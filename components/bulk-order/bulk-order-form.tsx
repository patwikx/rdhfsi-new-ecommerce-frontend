'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartStore } from '@/lib/store/cart-store';
import { createQuote } from '@/lib/actions/quote-actions';
import { toast } from 'sonner';
import { Plus, Trash2, ShoppingCart, MessageSquare, Package } from 'lucide-react';

interface BulkItem {
  id: string;
  sku: string;
  productName: string;
  quantity: number;
  notes: string;
}

export function BulkOrderForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('manual');
  const [isProcessing, setIsProcessing] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  // Manual entry state
  const [items, setItems] = useState<BulkItem[]>([
    { id: '1', sku: '', productName: '', quantity: 1, notes: '' },
  ]);

  // Quote request state
  const [quoteData, setQuoteData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    message: '',
  });

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), sku: '', productName: '', quantity: 1, notes: '' },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BulkItem, value: string | number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddToCart = () => {
    const validItems = items.filter((item) => item.sku && item.productName && item.quantity > 0);

    if (validItems.length === 0) {
      toast.error('Please add at least one valid item');
      return;
    }

    validItems.forEach((item) => {
      addToCart({
        id: `bulk-${item.id}-${Date.now()}`,
        productId: item.sku, // Using SKU as productId for now
        name: item.productName,
        sku: item.sku,
        price: 0, // Price will be determined later
        quantity: item.quantity,
        maxStock: 999,
      });
    });

    toast.success(`Added ${validItems.length} items to cart`);
    router.push('/checkout');
  };

  const handleRequestQuote = async () => {
    const validItems = items.filter((item) => item.productName && item.quantity > 0);

    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    if (!quoteData.customerName || !quoteData.customerEmail || !quoteData.customerPhone) {
      toast.error('Please fill in your contact information');
      return;
    }

    setIsProcessing(true);

    const result = await createQuote({
      customerName: quoteData.customerName,
      customerEmail: quoteData.customerEmail,
      customerPhone: quoteData.customerPhone,
      companyName: quoteData.companyName || undefined,
      message: quoteData.message || undefined,
      items: validItems.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
    });

    setIsProcessing(false);

    if (result.success) {
      toast.success('Quote request submitted!', {
        description: `Quote #${result.quote?.quoteNumber}`,
      });
      router.push('/profile/quotes');
    } else {
      toast.error(result.error || 'Failed to submit quote request');
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="csv">CSV Upload</TabsTrigger>
      </TabsList>

      <TabsContent value="manual" className="space-y-8 mt-8">
        {/* Items */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Items</h2>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-start p-5 bg-muted/30 rounded-lg border border-border">
                <div className="col-span-12 sm:col-span-2">
                  <Label htmlFor={`sku-${item.id}`} className="text-sm mb-2 block">
                    SKU
                  </Label>
                  <Input
                    id={`sku-${item.id}`}
                    value={item.sku}
                    onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                    placeholder="SKU"
                  />
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <Label htmlFor={`name-${item.id}`} className="text-sm mb-2 block">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`name-${item.id}`}
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-2">
                  <Label htmlFor={`qty-${item.id}`} className="text-sm mb-2 block">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`qty-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                </div>

                <div className="col-span-12 sm:col-span-3">
                  <Label htmlFor={`notes-${item.id}`} className="text-sm mb-2 block">
                    Notes
                  </Label>
                  <Input
                    id={`notes-${item.id}`}
                    value={item.notes}
                    onChange={(e) => updateItem(item.id, 'notes', e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>

                <div className="col-span-12 sm:col-span-1 flex items-end justify-center sm:justify-start">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information for Quote */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold">Contact Information (For Quote Request)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                value={quoteData.customerName}
                onChange={(e) => setQuoteData({ ...quoteData, customerName: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm">
                Company Name
              </Label>
              <Input
                id="companyName"
                value={quoteData.companyName}
                onChange={(e) => setQuoteData({ ...quoteData, companyName: e.target.value })}
                placeholder="Your company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="text-sm">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={quoteData.customerEmail}
                onChange={(e) => setQuoteData({ ...quoteData, customerEmail: e.target.value })}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone" className="text-sm">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerPhone"
                type="tel"
                value={quoteData.customerPhone}
                onChange={(e) => setQuoteData({ ...quoteData, customerPhone: e.target.value })}
                placeholder="09XX XXX XXXX"
              />
            </div>

            <div className="col-span-full space-y-2">
              <Label htmlFor="message" className="text-sm">
                Message
              </Label>
              <Textarea
                id="message"
                value={quoteData.message}
                onChange={(e) => setQuoteData({ ...quoteData, message: e.target.value })}
                placeholder="Any special requirements or questions..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button onClick={handleRequestQuote} variant="outline" size="lg" disabled={isProcessing} className="w-full sm:w-auto">
            <MessageSquare className="w-4 h-4 mr-2" />
            {isProcessing ? 'Submitting...' : 'Request Quote'}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="csv" className="mt-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">CSV Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with columns: SKU, Product Name, Quantity, Notes
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-16 text-center mt-6">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <p className="text-lg text-muted-foreground mb-2">CSV upload coming soon</p>
            <p className="text-sm text-muted-foreground">
              For now, please use manual entry or contact us directly
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
