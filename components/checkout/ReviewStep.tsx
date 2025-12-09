'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Address, PaymentMethod, LineItem, OrderDetails } from '../../app/types/solidus';
import { useCartStore } from '../../app/store/useCartStore';
import { 
  MapPin, 
  CreditCard, 
  Package, 
  CheckCircle2,
  Truck
} from 'lucide-react';

interface ReviewStepProps {
  billingAddress: Address | null;
  shippingAddress: Address | null;
  paymentData: PaymentMethod | null;
  onPlaceOrder: () => void;
  loading: boolean;
  orderDetails: OrderDetails | null;
}

export default function ReviewStep({
  billingAddress,
  shippingAddress,
  paymentData,
  onPlaceOrder,
  loading,
  orderDetails
}: ReviewStepProps) {
  const { cart } = useCartStore();

  const formatAddress = (address: Address | null) => {
    if (!address) return 'Not provided';
    
    const parts = [
      address.name,
      address.address1,
      address.address2,
      `${address.city}, ${address.state_name || ''} ${address.zipcode || ''}`.trim(),
      address.country_name,
      address.phone && `Phone: ${address.phone}`
    ].filter(Boolean);
    
    return parts.join('\n');
  };

  // Extract payment method from orderDetails.payments array
  const payment = orderDetails?.payments?.[0];
  const selectedPayment = payment?.payment_method || paymentData;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Order</h2>
        <p className="text-gray-600">Please review all details before placing your order</p>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cart?.line_items?.map((item: LineItem) => (
              <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {(item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url) ? (
                    <img 
                      src={item.variant?.images?.[0]?.url || item.variant?.product?.images?.[0]?.url || ''} 
                      alt={item.variant?.product?.name || 'Product'} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {item.variant?.product?.name || item.variant?.name || 'Product'}
                  </h4>
                  {item.variant?.sku && (
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.variant.sku}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                    <span className="font-semibold text-gray-900">{item.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Billing Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-gray-700">
              {formatAddress(orderDetails?.bill_address || billingAddress)}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-gray-700">
              {formatAddress(orderDetails?.ship_address || shippingAddress)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPayment ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{selectedPayment.name}</span>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              {selectedPayment.description && (
                <p className="text-sm text-gray-600">{selectedPayment.description}</p>
              )}
              {payment && (
                <div className="mt-3 pt-3 border-t space-y-2">
                  {payment.amount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Amount</span>
                      <span className="font-medium text-gray-900">{payment.amount}</span>
                    </div>
                  )}
                  {payment.state && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="font-medium text-gray-900 capitalize">{payment.state}</span>
                    </div>
                  )}
                  {payment.number && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Number</span>
                      <span className="font-medium text-gray-900">{payment.number}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment method selected</p>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{cart?.item_total || '$0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{cart?.ship_total || '$0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">$0.00</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">{cart?.total || '$0.00'}</span>
            </div>
          </div>
        </CardContent>
      </Card> 
    </div>
  );
}
