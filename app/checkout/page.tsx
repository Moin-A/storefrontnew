'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/userStore';
import { useUIStore } from '../store/useUIStore';
import { useOrderStore } from '../store/useOrderStore';
import { Order, Address, PaymentMethod } from '../types/solidus';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';



import { 
CreditCard, 
MapPin, 
Package, 
Check, 
Lock
} from 'lucide-react';
import CompleteStep from '../../components/checkout/CompleteStep';
import OrderSummary from '../../components/checkout/OrderSummary';
import ReviewStep from '../../components/checkout/ReviewStep';
import PaymentStep from '../../components/checkout/PaymentStep';
import DeliveryStep from '../../components/checkout/DeliveryStep';
import { SOLIDUS_ROUTES } from '../../lib/routes';
import { COUNTRIES, STATES } from '../../lib/constants';
import { AddressSection } from '../../components/AddressForm';

type CheckoutStep = 'address' | 'delivery' | 'payment' | 'confirm' | 'complete';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const { fetchShippingMethods, shippingData, fetchCurrentOrder, currentOrder } = useOrderStore(); // Initialize order store
  const { user, isAuthenticated, fetchDefaultAddress, Defaultaddress } = useUserStore();
  const { addOrder } = useOrderStore();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const addNotification = useUIStore((state) => state.addNotification);
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [loading, setLoading] = useState(false);
  const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<Address | null>(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<Address | null>(null);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [useDefaultBilling, setUseDefaultBilling] = useState(false);
  const [useDefaultShipping, setUseDefaultShipping] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);


  // Payment form state
  const [paymentData, setPaymentData] = useState<PaymentMethod | null>(null);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state_id: '',
    zipcode: '',
    country_id: '',
    phone: '',
    is_default: false
  });


  const fetchPaymentMethods = async () => {
    const response = await fetch(SOLIDUS_ROUTES.api.payment_methods, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include'
    });
    const data = await response.json();
    setPaymentMethods(data);
  }
   

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart();
      fetchDefaultAddress();
      fetchShippingMethods();
      fetchPaymentMethods();
      fetchCurrentOrder();
      const cartState = cart?.state;
      setCurrentStep((cart?.state as CheckoutStep) || 'address');
    }
  }, [isAuthenticated, user]);


  // Function to get default billing address attributes
  const getDefaultBillingAddressAttributes = () => {
    const defaultBilling: any = Defaultaddress.find((addr: any) => addr?.user_address?.default_billing === true);
    if (!defaultBilling) return null;
    
    return {
      id: defaultBilling.id,
      name: defaultBilling.name,
      address1: defaultBilling.address1,
      address2: defaultBilling.address2,
      city: defaultBilling.city,
      zipcode: defaultBilling.zipcode,
      phone: defaultBilling.phone,
      state_id: defaultBilling.state_id,
      state_name: defaultBilling.state_name,
      country_id: defaultBilling.country_id,
      company: defaultBilling.company
    };
  };

  // Function to get default shipping address attributes
  const getDefaultShippingAddressAttributes = () => {
    const defaultShipping: any = Defaultaddress.find((addr: any) => addr?.user_address?.default_shipping === true);
    if (!defaultShipping) return null;
    
    return {
      id: defaultShipping.id,
      name: defaultShipping.name,
      address1: defaultShipping.address1,
      address2: defaultShipping.address2,
      city: defaultShipping.city,
      zipcode: defaultShipping.zipcode,
      phone: defaultShipping.phone,
      state_id: defaultShipping.state_id,
      state_name: defaultShipping.state_name,
      country_id: defaultShipping.country_id,
      company: defaultShipping.company
    };
  };

  const handleNextStep = async (optionalMethod?: any) => {

    // Build payload with full address attributes
    const payload: any = {
      order: {}
    };
    if (currentStep === 'address') {
      // Check if using default addresses or if addresses are selected
      const hasBillingAddress = useDefaultBilling || selectedBillingAddress;
      const hasShippingAddress = useDefaultShipping || useSameAddress || selectedShippingAddress;
    
      if (!hasBillingAddress || !hasShippingAddress) {
        alert('Please select billing and shipping addresses');
        return;
      }
        // Add billing address
        if (useDefaultBilling) {
          const billingAttrs = getDefaultBillingAddressAttributes();
          if (billingAttrs) {
            payload.order.bill_address_attributes = billingAttrs;
          }
        } else if (selectedBillingAddress) {
          payload.order.bill_address_attributes = {
            id: selectedBillingAddress.id,
            name: selectedBillingAddress.name,
            address1: selectedBillingAddress.address1,
            address2: selectedBillingAddress.address2,
            city: selectedBillingAddress.city,
            zipcode: selectedBillingAddress.zipcode,
            phone: selectedBillingAddress.phone,
            state_id: selectedBillingAddress.state_id,
            state_name: selectedBillingAddress.state_name,
            country_id: selectedBillingAddress.country_id,
            company: selectedBillingAddress.company
          };
        }

        // Add shipping address
        if (useDefaultShipping || useSameAddress) {
          const shippingAttrs = useSameAddress 
            ? getDefaultBillingAddressAttributes() 
            : getDefaultShippingAddressAttributes();
          if (shippingAttrs) {
            payload.order.ship_address_attributes = shippingAttrs;
          }
        } else if (selectedShippingAddress) {
          payload.order.ship_address_attributes = {
            id: selectedShippingAddress.id,
            name: selectedShippingAddress.name,
            address1: selectedShippingAddress.address1,
            address2: selectedShippingAddress.address2,
            city: selectedShippingAddress.city,
            zipcode: selectedShippingAddress.zipcode,
            phone: selectedShippingAddress.phone,
            state_id: selectedShippingAddress.state_id,
            state_name: selectedShippingAddress.state_name,
            country_id: selectedShippingAddress.country_id,
            company: selectedShippingAddress.company
          };
        }

        const res = await fetch(SOLIDUS_ROUTES.api.checkout_update(cart?.number), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        })

        if(!res.ok){
          addNotification('error', 'Failed to update checkout');
          return;
        }

        const data = await res.json();
     
        setCurrentStep((data?.state ?? 'delivery') as CheckoutStep)
     
    } else if (currentStep === 'delivery') {
       const res = await fetch(SOLIDUS_ROUTES.api.checkout_next(cart?.number), {
         method: 'PATCH',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload),
       });

       if(!res.ok){
         addNotification('error', 'Failed to update checkout');
         return;
       }

       const data = await res.json();
       setCurrentStep((data?.state ?? 'payment') as CheckoutStep);
    } else if (currentStep === 'payment') {

      payload.order.payments_attributes = [
        {
          payment_method_id: paymentData?.id
        }
      ];
      
      const res = await fetch(SOLIDUS_ROUTES.api.checkout_update(cart?.number), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if(!res.ok){
        addNotification('error', 'Failed to update checkout');
        return;
      }
      const data = await res.json();
      setCurrentStep((data?.state ?? 'confirm') as CheckoutStep)  
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
      
      const res = await fetch(SOLIDUS_ROUTES.api.checkout_complete(cart?.number), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
      if(!res.ok){
        addNotification('error', 'Failed to complete checkout');
        return;
      }
      const data = await res.json();
      setCurrentStep((data?.state ?? 'complete') as CheckoutStep)
      addOrder(data);
   
  };

  const handleAddNewAddress = async () => {
    try {
      // TODO: Add new address via API
      const newAddr: Address = {
        id: Date.now(),
        ...newAddress
      };
      
      // Add to billing addresses (since this is the billing form)
      const existsInBilling = billingAddresses.some(addr => addr.id === newAddr.id);
      if (!existsInBilling) {
        setBillingAddresses([...billingAddresses, newAddr]);
      }
      setSelectedBillingAddress(newAddr);
      
      // Reset form
      setNewAddress({
        name: '',
        address1: '',
        address2: '',
        city: '',
        state_id: '',
        zipcode: '',
        country_id: '',
        phone: '',
        is_default: false
      });
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to proceed with checkout.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  if (!cart || cart.line_items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checking out.</p>
          <Button asChild>
            <a href="/products">Continue Shopping</a>
          </Button>
        </Card>
      </div>
    );
  }

  const steps = [
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'delivery', label: 'Delivery', icon: Package },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirm', label: 'Confirm', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : isCompleted 
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 'address' && (
              <AddressStep 
                billingAddresses={billingAddresses}
                shippingAddresses={shippingAddresses}
                selectedBillingAddress={selectedBillingAddress}
                selectedShippingAddress={selectedShippingAddress}
                useSameAddress={useSameAddress}
                useDefaultBilling={useDefaultBilling}
                useDefaultShipping={useDefaultShipping}
                newAddress={newAddress}
                onBillingAddressChange={setSelectedBillingAddress}
                onShippingAddressChange={setSelectedShippingAddress}
                onUseSameAddressChange={setUseSameAddress}
                onDefaultBillingChange={setUseDefaultBilling}
                onDefaultShippingChange={setUseDefaultShipping}
                onNewAddressChange={setNewAddress}
                onAddNewAddress={handleAddNewAddress}
                Defaultaddress={Defaultaddress}
                onSetBillingAddresses={setBillingAddresses}
                onSetShippingAddresses={setShippingAddresses}
                getDefaultBillingAddressAttributes={getDefaultBillingAddressAttributes}
                getDefaultShippingAddressAttributes={getDefaultShippingAddressAttributes}
              />
            )}

            {currentStep === 'delivery' && (
              <DeliveryStep onNext={(selectedMethod) => handleNextStep(selectedMethod)} />
            )}

            {currentStep === 'payment' && (
              <PaymentStep 
                paymentData={paymentData}
                onPaymentDataChange={setPaymentData}
                paymentMethods={paymentMethods}
              />
            )}

            {currentStep === 'confirm' && (
              <ReviewStep 
                billingAddress={selectedBillingAddress}
                shippingAddress={selectedShippingAddress}
                paymentData={paymentData}
                onPlaceOrder={handlePlaceOrder}
                loading={loading}
                orderDetails={currentOrder}
              />
            )}

            {currentStep === 'complete' && (
              <CompleteStep />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary 
              cart={cart}
              currentStep={currentStep}
              onNextStep={()=>handleNextStep()}
              onPlaceOrder={handlePlaceOrder}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Address Step Component
function AddressStep({
  billingAddresses,
  shippingAddresses,
  selectedBillingAddress,
  selectedShippingAddress,
  useSameAddress,
  useDefaultBilling,
  useDefaultShipping,
  Defaultaddress,
  newAddress,
  onBillingAddressChange,
  onShippingAddressChange,
  onUseSameAddressChange,
  onDefaultBillingChange,
  onDefaultShippingChange,
  onNewAddressChange,
  onAddNewAddress,
  onSetBillingAddresses,
  onSetShippingAddresses,
  getDefaultBillingAddressAttributes,
  getDefaultShippingAddressAttributes
}: {
  billingAddresses: Address[];
  shippingAddresses: Address[];
  selectedBillingAddress: Address | null;
  selectedShippingAddress: Address | null;
  useSameAddress: boolean;
  useDefaultBilling: boolean;
  useDefaultShipping: boolean;
  newAddress: any;
  Defaultaddress: any;
  onBillingAddressChange: (address: Address | null) => void;
  onShippingAddressChange: (address: Address | null) => void;
  onUseSameAddressChange: (useSame: boolean) => void;
  onDefaultBillingChange: (useDefault: boolean) => void;
  onDefaultShippingChange: (useDefault: boolean) => void;
  onNewAddressChange: (address: any) => void;
  onAddNewAddress: () => void;
  onSetBillingAddresses: (addresses: Address[]) => void;
  onSetShippingAddresses: (addresses: Address[]) => void;
  getDefaultBillingAddressAttributes: () => any;
  getDefaultShippingAddressAttributes: () => any;
}) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showNewShippingAddressForm, setShowNewShippingAddressForm] = useState(false);
  const [newShippingAddress, setNewShippingAddress] = useState({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state_id: '',
    zipcode: '',
    country_id: '',
    phone: '',
    is_default: false
  });

  const handleAddNewShippingAddress = async () => {
    try {
      // TODO: Add new shipping address via API
      const newAddr: Address = {
        id: Date.now() + 1000, // Different ID to avoid conflicts
        ...newShippingAddress
      };
      
      // Add to shipping addresses (since this is the shipping form)
      const existsInShipping = shippingAddresses.some(addr => addr.id === newAddr.id);
      if (!existsInShipping) {
        onSetShippingAddresses([...shippingAddresses, newAddr]);
      }
      onShippingAddressChange(newAddr);
      
      setShowNewShippingAddressForm(false);
      
      // Reset form
      setNewShippingAddress({
        name: '',
        address1: '',
        address2: '',
        city: '',
        state_id: '',
        zipcode: '',
        country_id: '',
        phone: '',
        is_default: false
      });
    } catch (error) {
      console.error('Error adding shipping address:', error);
    }
  };


  // Function to handle order creation with address IDs
  const handleCreateOrder = async () => {
    try {
      // setLoading(true); // Remove this line as setLoading is not available in this scope
      
      const payload: any = {
        order: {}
      };

      // Add billing address attributes if using default billing
      if (useDefaultBilling) {
        const billingAttrs = getDefaultBillingAddressAttributes();
        if (billingAttrs) {
          payload.order.bill_address_attributes = billingAttrs;
        }
      }

      // Add shipping address attributes if using default shipping
      if (useDefaultShipping) {
        const shippingAttrs = getDefaultShippingAddressAttributes();
        if (shippingAttrs) {
          payload.order.ship_address_attributes = shippingAttrs;
        }
      }

      // Make API call
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const order = await response.json();
        // addOrder(order); // Remove this line as addOrder is not available in this scope
        // setOrderComplete(true); // Remove this line as setOrderComplete is not available in this scope
        // setCurrentStep('complete'); // Remove this line as setCurrentStep is not available in this scope
      } else {
        console.error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      // setLoading(false); // Remove this line as setLoading is not available in this scope
    }
  };

  return(
    <div className="space-y-6">
  <AddressSection
    title="Billing Address"
    sameAsLabel="Same as Billing address"
    useDefault={useDefaultBilling}
    onDefaultChange={onDefaultBillingChange}
    addresses={billingAddresses}
    selectedAddress={selectedBillingAddress}
    onAddressChange={onBillingAddressChange}
    showNewAddressForm={showNewAddressForm}
    setShowNewAddressForm={setShowNewAddressForm}
    newAddress={newAddress}
    onNewAddressChange={onNewAddressChange}
    onAddNewAddress={onAddNewAddress}
    COUNTRIES={COUNTRIES}
    STATES={STATES}
  />

  <AddressSection
    title="Shipping Address"
    sameAsLabel="Same as Shipping address"
    useDefault={useDefaultShipping}
    onDefaultChange={onDefaultShippingChange}
    addresses={shippingAddresses}
    selectedAddress={selectedShippingAddress}
    onAddressChange={onShippingAddressChange}
    showNewAddressForm={showNewShippingAddressForm}
    setShowNewAddressForm={setShowNewShippingAddressForm}
    newAddress={newShippingAddress}
    onNewAddressChange={setNewShippingAddress}
    onAddNewAddress={handleAddNewShippingAddress}
    COUNTRIES={COUNTRIES}
    STATES={STATES}
  />
</div>
);
}
