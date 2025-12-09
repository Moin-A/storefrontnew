import { Package } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { LineItem, Cart } from '../../app/types/solidus';

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'confirm' | 'complete';

interface OrderSummaryProps {
  cart: Cart | null;
  currentStep: CheckoutStep;
  onNextStep: () => void;
  onPlaceOrder: () => void;
  loading: boolean;
}

export default function OrderSummary({
  cart,
  currentStep,
  onNextStep,
  onPlaceOrder,
  loading
}: OrderSummaryProps) {
  return (
    <Card className="p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        {cart?.line_items?.map((item: LineItem) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.variant?.product?.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{item.total}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>{cart?.item_total}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span>{cart?.display_ship_total || '$0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span>{cart?.display_tax_total || '$0.00'}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{cart?.total}</span>
        </div>
      </div>

      {currentStep === 'address' && (
        <Button onClick={onNextStep} className="w-full">
          Continue to Delivery
        </Button>
      )}

      {currentStep === 'delivery' && (
        <Button onClick={onNextStep} className="w-full">
          Continue to Payment
        </Button>
      )}

      {currentStep === 'payment' && (
        <Button onClick={onNextStep} className="w-full">
          Continue to Confirm
        </Button>
      )}

      {currentStep === 'confirm' && (
        <Button 
          onClick={onPlaceOrder} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      )}
    </Card>
  );
}
