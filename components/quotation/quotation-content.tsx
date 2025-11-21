'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuotationStore } from '@/lib/stores/quotation-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { submitQuotation } from '@/lib/actions/quotation-actions';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function QuotationContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, updateQuantity, removeItem, clearItems, getSubtotal } = useQuotationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    message: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
        customerPhone: (session.user as { phone?: string }).phone || '',
        companyName: (session.user as { companyName?: string }).companyName || '',
        message: '',
      });
    }
  }, [session]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('No items in quotation');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitQuotation({
        ...formData,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          notes: '',
        })),
      });

      if (result.success && result.quoteId) {
        // Don't clear items yet - wait for navigation
        router.push(`/quotation/${result.quoteId}`);
        // Clear items after a delay to prevent flash
        setTimeout(() => {
          clearItems();
        }, 1000);
      } else {
        toast.error(result.error || 'Failed to submit quotation');
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Something went wrong');
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No items for quotation</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add products to your quotation list to request a quote
        </p>
        <Link href="/">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();

  return (
    <>
      {/* Loading Dialog */}
      <Dialog open={isSubmitting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Generating Your Quotation
            </DialogTitle>
            <DialogDescription>
              Please wait while we prepare your quotation document...
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-sm text-muted-foreground text-center">
              This will only take a moment
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Items Table */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Items for Quotation</h2>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Product</th>
                  <th className="text-center p-4 font-semibold">Price</th>
                  <th className="text-center p-4 font-semibold">Quantity</th>
                  <th className="text-right p-4 font-semibold">Subtotal</th>
                  <th className="text-center p-4 font-semibold w-20"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-medium hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">₱{formatPrice(item.price)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      {item.maxStock !== undefined && (
                        <p className="text-xs text-center text-muted-foreground mt-1">
                          Max: {item.maxStock}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-right font-semibold">
                      ₱{formatPrice(item.price * item.quantity)}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-muted/30">
                <tr>
                  <td colSpan={3} className="p-4 text-right font-semibold">
                    Total:
                  </td>
                  <td className="p-4 text-right font-bold text-lg">
                    ₱{formatPrice(subtotal)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Quotation Form */}
      <div className="lg:col-span-1">
        <h2 className="text-xl font-bold mb-4">Your Information</h2>
        
        <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message / Requirements</Label>
            <Textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Any specific requirements or questions..."
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Quotation Request'}
          </Button>
        </form>
      </div>
    </div>
    </>
  );
}
