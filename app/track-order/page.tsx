'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface OrderStatus {
  id: string;
  orderNumber: string;
  trackingNumber: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  createdAt: Date;
  shippedAt: Date | null;
  estimatedDelivery: Date | null;
  shippingMethod: string | null;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<OrderStatus | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setError('');
    setOrderData(null);

    try {
      const { trackOrder } = await import('@/app/actions/orders');
      const result = await trackOrder(trackingNumber.trim());

      if (!result.success || !result.order) {
        setError(result.error || 'Order not found. Please check your tracking number.');
        setOrderData(null);
      } else {
        setOrderData(result.order);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to track order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'SHIPPED':
        return <Truck className="h-6 w-6 text-blue-600" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground">
            Enter your tracking number to check your order status
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">Enter Tracking Number</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            You can find your tracking number in your order confirmation email
          </p>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="trackingNumber" className="sr-only">
                Tracking Number
              </Label>
              <Input
                id="trackingNumber"
                type="text"
                placeholder="e.g., TRK-251121-001-A3F9K2"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="font-mono"
              />
            </div>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-8">
            {/* Status Section */}
            <div className="border-b pb-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(orderData.status)}
                  <div>
                    <h2 className="text-xl font-bold">Order Status</h2>
                    <p className="text-sm text-muted-foreground">Order #{orderData.orderNumber}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(orderData.status)}`}
                >
                  {orderData.status}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-mono font-medium">{orderData.trackingNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{formatDate(orderData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <p className="font-medium">{orderData.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fulfillment Status</p>
                  <p className="font-medium">{orderData.fulfillmentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{orderData.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{orderData.customerEmail}</p>
                </div>
              </div>

              {orderData.shippingMethod && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted p-3">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Shipping Method: <span className="font-medium">{orderData.shippingMethod}</span>
                  </span>
                </div>
              )}

              {orderData.estimatedDelivery && (
                <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted p-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Estimated Delivery:{' '}
                    <span className="font-medium">{formatDate(orderData.estimatedDelivery)}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h2 className="mb-4 text-xl font-bold">Order Items</h2>
              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₱{formatPrice(item.unitPrice * item.quantity)}</p>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t-2 pt-4">
                  <p className="text-lg font-bold">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ₱{formatPrice(orderData.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
