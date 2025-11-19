import { redirect, notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getOrderById } from '@/app/actions/orders';
import { Package, CreditCard, Truck, MapPin, Building2, FileText, ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login?redirect=/orders');
  }

  const { id } = await params;
  const result = await getOrderById(id);

  if (!result.success || !result.order) {
    notFound();
  }

  const order = result.order;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'SHIPPED':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-4 py-6">
        {/* Back Button */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order {order.orderNumber}</h1>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span className={`text-sm font-medium px-4 py-2 rounded-full ${getStatusColor(order.status)} w-fit`}>
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Customer & Order Information */}
          <div className="border border-border rounded-lg p-6 space-y-6 h-fit">
            {/* Customer Information */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Customer Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </p>
                  <p className="font-medium text-sm break-all">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </p>
                  <p className="font-medium text-sm">{order.customerPhone}</p>
                </div>
                {order.companyName && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Company
                    </p>
                    <p className="font-medium">{order.companyName}</p>
                    {order.taxId && (
                      <p className="text-sm text-muted-foreground mt-1">TIN: {order.taxId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery & Payment Information */}
            <div className="pt-6 border-t border-border grid grid-cols-2 gap-6">
              {/* Delivery Information */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Delivery
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Method</p>
                      <p className="font-medium">{order.shippingMethod}</p>
                    </div>
                    {order.trackingNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tracking</p>
                        <p className="font-medium font-mono text-sm">{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                  {order.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment
                </h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Method</p>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                                        <div>
                     {order.poNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        PO Number
                      </p>
                      <p className="font-medium font-mono text-sm">{order.poNumber}</p>
                    </div>
                  )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${
                        order.paymentStatus === 'PAID' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </div>


                  </div>
                 
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₱{formatPrice(order.subtotal)}</span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₱{formatPrice(order.discountAmount)}</span>
                  </div>
                )}

                {order.taxBreakdown.map((tax) => (
                  <div key={tax.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{tax.taxName}</span>
                    <span className="font-medium">₱{formatPrice(tax.taxAmount)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Fee</span>
                  <span className="font-medium">
                    {order.shippingAmount === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₱${formatPrice(order.shippingAmount)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₱{formatPrice(order.totalAmount)}</span>
                </div>
              </div>

              {order.couponRedemptions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-2">Coupons Applied</p>
                  {order.couponRedemptions.map((redemption) => (
                    <div key={redemption.id} className="text-xs text-muted-foreground">
                      {redemption.coupon.code} - ₱{formatPrice(redemption.discountAmount)} off
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="border border-border rounded-lg p-6 space-y-6 h-fit">
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Items ({order.items.length})
              </h2>
              <div className="max-h-[600px] overflow-y-auto pr-2">
                <div className="space-y-2.5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-2.5 border-b border-border last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.product?.images?.[0]?.url && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product?.slug || ''}`}
                          className="font-medium text-sm hover:text-primary transition-colors block line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <p className="text-[10px] text-muted-foreground font-mono mt-1">
                          SKU: {item.productSku}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity} × ₱{formatPrice(item.unitPrice)}
                          </p>
                          <p className="font-bold text-sm">₱{formatPrice(item.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
