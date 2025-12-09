import { Shield, CreditCard, Wallet, Landmark } from 'lucide-react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { PaymentMethod } from '../../app/types/solidus'
import { useEffect } from 'react'

interface PaymentData {
  id?: number;
  payment_method_id?: number;
  [key: string]: unknown;
}

interface PaymentStepProps {
  paymentData: PaymentData | null;
  onPaymentDataChange: (data: PaymentMethod) => void;
  paymentMethods: PaymentMethod[];
}

export default function PaymentStep({
  paymentData,
  onPaymentDataChange,
  paymentMethods
}: PaymentStepProps) {
  const selectedMethodId = paymentData?.id
  // console.log("paymentDatapaymentData",{paymentData})

  // useEffect(() => {
  //   if (!selectedMethodId && paymentMethods.length) {      
  //     onPaymentDataChange({
  //       ...paymentData,
  //       payment_method_id: paymentMethods[0].id,
  //     })
  //   }
  // }, [paymentMethods, paymentData, onPaymentDataChange, selectedMethodId])

  const renderPaymentIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'Spree::PaymentMethod::StoreCredit':
        return <Wallet className="h-5 w-5 text-purple-500" />
      case 'Spree::PaymentMethod::Check':
        return <Landmark className="h-5 w-5 text-amber-500" />
      case 'Spree::PaymentMethod::CreditCard':
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-5 w-5 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
        <span className="text-sm text-green-600">Secure</span>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block text-sm font-medium text-gray-700">Payment Method</Label>
          <div className="space-y-3">
            {paymentMethods?.length ? (
              paymentMethods.map((method) => {
                debugger;
                const isSelected = paymentData?.id === method.id
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      onPaymentDataChange({
                          ...method
                      })
                    }
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/40'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{renderPaymentIcon(method)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{method.name}</span>
                          {isSelected && (
                            <span className="text-xs font-semibold uppercase text-blue-600">Selected</span>
                          )}
                        </div>
                        {method.description && (
                          <p className="mt-1 text-xs text-gray-600">{method.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
                No payment methods available. Please contact support.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
