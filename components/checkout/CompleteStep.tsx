import { Check } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export default function CompleteStep() {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <a href="/profile">View Orders</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    </Card>
  );
}
