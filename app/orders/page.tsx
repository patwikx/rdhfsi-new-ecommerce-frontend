import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getUserOrders } from '@/app/actions/orders';
import { Package } from 'lucide-react';
import { OrdersList } from '@/components/orders/orders-list';

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

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>

        <OrdersList orders={result.orders} />
      </div>
    </div>
  );
}
