import { useState, useEffect } from 'react';
import { useOrderStore } from '../../app/store/useOrderStore';
import { useCartStore } from '../../app/store/useCartStore';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ShippingRate, Shipment } from '../../app/types/solidus';

interface ShippingMethod {
  id: number;
  name: string;
  admin_name?: string;
  shipping_rates?: ShippingRate[];
}

interface ShippingMethodOption {
  methodId: number;
  methodName: string;
  adminName?: string;
  rateId: number | string;
  cost: string | number;
  displayCost: string;
  selected: boolean;
  shipmentId: number;
}

interface ShippingData {
  shipments?: Array<Shipment & {
    shipping_methods?: ShippingMethod[];
  }>;
}

interface DeliveryStepProps {
  onNext?: (selectedMethod?: string) => void;
}

export default function DeliveryStep({ onNext }: DeliveryStepProps) {
  const { fetchShippingMethods, shippingData } = useOrderStore();
  const { cart } = useCartStore();
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  // Extract shipping methods from shipments[0].shipping_methods[]
  // One option per method, using shipping_rates[0]
  const getShippingMethods = (): ShippingMethodOption[] => {
    const methods: ShippingMethodOption[] = [];
    
    const data = shippingData as ShippingData;
    if (data?.shipments && data.shipments[0]?.shipping_methods) {
      const shipmentMethods = data.shipments[0].shipping_methods;
      shipmentMethods.forEach((method: ShippingMethod) => {
        const firstRate = method.shipping_rates?.[0];
        if (firstRate && data.shipments?.[0]) {
          methods.push({
            methodId: method.id,
            methodName: method.name,
            adminName: method.admin_name,
            rateId: firstRate.id || String(firstRate.id),
            cost: firstRate.cost,
            displayCost: firstRate.display_cost || String(firstRate.cost),
            selected: firstRate.selected === true,
            shipmentId: data.shipments[0].id || 0
          });
        }
      });
    }
    
    return methods;
  };

  const shippingMethods = getShippingMethods();

  // Set initial selection based on selected flag
  useEffect(() => {
    const selectedMethod = shippingMethods.find(m => m.selected);
    if (selectedMethod && !selectedRateId) {
      setSelectedRateId(selectedMethod.rateId);
    }
  }, [shippingMethods]);

  // Format cost as ₹50.00
  const formatCost = (cost: string | number | undefined) => {
    if (!cost) return '₹0.00';
    const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
    return `₹${numCost.toFixed(2)}`;
  };

  const handleContinue = () => {
    if (selectedRateId && onNext) {
      onNext(selectedRateId);
    }
  };

  return (
    <div className="space-y-6">    
      {cart && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Total</span>
              <span className="font-medium text-gray-900">{cart.item_total || '₹0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipment Total</span>
              <span className="font-medium text-gray-900">{cart.ship_total || '₹0.00'}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{cart.total || '₹0.00'}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
