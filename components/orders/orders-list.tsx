'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Calendar, CreditCard, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalAmount: number;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [filter, setFilter] = useState<string>('all');

  const getStatusColor = (status: string): string => {
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

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-border">
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({orders.length})
        </Button>
        <Button
          variant={filter === 'PENDING' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('PENDING')}
        >
          Pending ({orders.filter((o) => o.status === 'PENDING').length})
        </Button>
        <Button
          variant={filter === 'PROCESSING' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('PROCESSING')}
        >
          Processing ({orders.filter((o) => o.status === 'PROCESSING').length})
        </Button>
        <Button
          variant={filter === 'SHIPPED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('SHIPPED')}
        >
          Shipped ({orders.filter((o) => o.status === 'SHIPPED').length})
        </Button>
        <Button
          variant={filter === 'DELIVERED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('DELIVERED')}
        >
          Delivered ({orders.filter((o) => o.status === 'DELIVERED').length})
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {filteredOrders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="group block border-2 border-border p-4 hover:border-primary transition-all hover:shadow-md"
          >
            <div className="flex flex-col h-full">
              {/* Order Number & Status */}
              <div className="mb-3">
                <h3 className="font-bold text-sm mb-2 truncate">{order.orderNumber}</h3>
                <span
                  className={`inline-block text-[10px] font-medium px-2 py-1 rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Details */}
              <div className="space-y-2 text-xs mb-4 flex-1">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{order.paymentStatus}</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                <p className="text-lg font-bold">₱{formatPrice(order.totalAmount)}</p>
              </div>

              {/* View Arrow */}
              <div className="flex justify-end mt-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border">
          <p className="text-muted-foreground">No orders found with this status</p>
        </div>
      )}
    </div>
  );
}
