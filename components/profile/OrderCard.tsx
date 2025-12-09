import { Order } from '../../app/types/solidus';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Package, Truck } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-gray-900">Order #{order.number}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.created_at || '').toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">{order.total}</div>
          <Badge 
            variant={order.state === 'complete' ? 'default' : 'secondary'}
            className="mt-1"
          >
            {order.state}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            {order.item_count} items
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            {order.ship_address?.city}, {order.ship_address?.state_name}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/account/orders/${order.id}`}>
            View Detail
          </Link>
        </Button>
      </div>
    </div>
  );
}
