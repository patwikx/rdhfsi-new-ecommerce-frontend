'use client';

import { CheckCircle2, XCircle, Mail, Package, Calendar, CreditCard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  trackingNumber?: string;
  customerEmail?: string;
  totalAmount?: number;
  error?: string;
}

export function OrderConfirmationDialog({
  open,
  onOpenChange,
  success,
  orderNumber,
  orderId,
  trackingNumber,
  customerEmail,
  totalAmount,
  error,
}: OrderConfirmationDialogProps) {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleViewOrder = () => {
    onOpenChange(false);
    if (orderId) {
      setTimeout(() => {
        router.push(`/orders/${orderId}`);
      }, 100);
    }
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Order Placed Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been received and is being processed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Order Number */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-2xl font-bold text-primary">{orderNumber}</p>
            </div>

            {/* Order Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">Pending Confirmation</span>
              </div>

              {trackingNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Tracking Number:</span>
                  <span className="font-mono font-medium">{trackingNumber}</span>
                </div>
              )}

              {totalAmount !== undefined && (
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">₱{formatPrice(totalAmount)}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-PH')}</span>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Order Confirmation Email
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    A confirmation email with order details will be sent to{' '}
                    <span className="font-medium">{customerEmail}</span>
                  </p>
                  {/* TODO: Implement email sending functionality */}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={handleViewOrder} size="lg" className="w-full">
                View Order Details
              </Button>
              <Button onClick={handleContinueShopping} variant="outline" size="lg" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Order Failed</DialogTitle>
          <DialogDescription className="text-center">
            We encountered an issue while processing your order.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-900 dark:text-red-100">
              {error || 'An unexpected error occurred. Please try again.'}
            </p>
          </div>

          {/* Help Text */}
          <div className="text-sm text-muted-foreground text-center">
            <p>If the problem persists, please contact our support team.</p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button onClick={() => onOpenChange(false)} variant="outline" size="lg" className="w-full">
              Try Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
