import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserOrders } from '@/app/actions/orders';
import { Package, Calendar, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/login?redirect=/orders');
  }

  const result = await getUserOrders();

  if (!result.success || !result.orders) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{result.error || 'Failed to load orders'}</p>
          </div>
        </div>
      </div>
    );
  }

  const orders = result.orders;

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
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start shopping to create your first order
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-base">{order.orderNumber}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Package className="w-3.5 h-3.5" />
                        <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total & Arrow */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Total Amount</p>
                      <p className="text-xl font-bold">₱{formatPrice(order.totalAmount)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
