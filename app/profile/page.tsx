'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useOrderStore } from '../store/useOrderStore';
import Link from 'next/link';
import { User, Order, Address } from '../types/solidus';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';


import { 
  User as UserIcon, 
  MapPin, 
  Package, 
  Star, 
  Edit, 
  Plus,
  Phone,
  Mail,
  Calendar,
  ShoppingBag,
  CreditCard,
  Truck
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { COUNTRIES, STATES, ADDRESS_TYPES } from '../../lib/constants';

// Mock data for reviews (you'll replace this with actual API calls)
const mockReviews = [
  {
    id: 1,
    productName: 'Wireless Headphones',
    rating: 5,
    comment: 'Excellent sound quality and comfortable fit!',
    date: '2024-01-15',
    productImage: '/placeholder-product.jpg'
  },
  {
    id: 2,
    productName: 'Smart Watch',
    rating: 4,
    comment: 'Great features, battery could be better.',
    date: '2024-01-10',
    productImage: '/placeholder-product.jpg'
  }
];

export default function ProfilePage() {
  const addNotification = useUIStore((state) => state.addNotification);
  const { user, isAuthenticated, fetchDefaultAddress, Defaultaddress, setDefaultAddress } = useUserStore();
  const { orders, fetchOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'reviews'>('overview');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch user orders and addresses
      fetchUserData();
      fetchOrder()
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      fetchDefaultAddress();
      setUserOrders(orders || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createAddress = async (addressData: any) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressData }),
      });

      if (response.ok) {
        const newAddress = await response.json();
        setDefaultAddress(newAddress); // Update the store for other components
        addNotification('success', 'Address created successfully!');
        return { success: true, data: newAddress };
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.errors?.join(', ') || 'Failed to create address';
        addNotification('error', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Error creating address:', error);
      addNotification('error', 'An error occurred while creating address');
      return { success: false, error: 'Network error' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your profile.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </Card>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">
                {user?.role || 'Customer'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <OverviewTab user={user} orders={userOrders} />}
            {activeTab === 'orders' && <OrdersTab orders={userOrders} loading={loading} />}
            {activeTab === 'addresses' && <AddressesTab addresses={Defaultaddress} loading={loading} onCreateAddress={createAddress} />}
            {activeTab === 'reviews' && <ReviewsTab reviews={mockReviews} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ user, orders }: { user: User | null; orders: Order[] }) {
  const totalOrders = orders?.length;
  const totalSpent = totalOrders && orders?.reduce((sum, order) => {
    return sum + parseFloat(order.total?.replace('$', '') || '0');
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{totalOrders}</div>
            <div className="text-sm text-blue-700">Total Orders</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">${totalSpent?.toFixed(2)}</div>
            <div className="text-sm text-green-700">Total Spent</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">4.8</div>
            <div className="text-sm text-purple-700">Average Rating</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {orders?.length > 0 ? (
          <div className="space-y-3">
            {orders?.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Order #{order.number}</div>
                  <div className="text-sm text-gray-600">{order.created_at}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{order.total}</div>
                  <Badge variant={order.state === 'complete' ? 'default' : 'secondary'}>
                    {order.state}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders yet</p>
        )}
      </Card>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
    
      {orders?.length > 0 ? (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
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
                  <Link href={`/account/orders/${order.number}`}>
                    View Detail
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
          <Button asChild>
            <a href="/products">Start Shopping</a>
          </Button>
        </div>
      )}
    </Card>
  );
}

// Addresses Tab Component
function AddressesTab({ addresses, loading, onCreateAddress }: { addresses: Address[]; loading: boolean; onCreateAddress: (addressData: any) => Promise<any> }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address1: '',
    address2: '',
    city: '',
    state_id: '',
    zipcode: '',
    country_id: '',
    phone: '',
    address_type: '',
    default: false
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateAddress = async () => {
    // Validate required fields
    if (!newAddress.name || !newAddress.state_id || !newAddress.country_id || !newAddress.address_type) {
      const addNotification = useUIStore.getState().addNotification;
      addNotification('error', 'Please fill in all required fields: Name, State, Country, and Address Type');
      return;
    }

    try {
      setIsCreating(true);
      const result = await onCreateAddress(newAddress);
      
      if (result.success) {
        // Only reset and close form on success
        setNewAddress({
          name:'',
          address1: '',
          address2: '',
          city: '',
          state_id: '',
          zipcode: '',
          country_id: '',
          phone: '',
          address_type: '',
          default: false
        });
        setShowAddForm(false);
      }
      // If error, keep form open so user can fix the errors
    } catch (error) {
      console.error('Error creating address:', error);
      // Error notification is already shown by createAddress function
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showAddForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name" className="mb-2 block">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="new-name"
                placeholder="Full name"
                required
                value={newAddress.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="new-address1" className="mb-2 block">Address Line 1</Label>
              <Input
                id="new-address1"
                value={newAddress.address1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, address1: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="new-address2" className="mb-2 block">Address Line 2 (Optional)</Label>
              <Input
                id="new-address2"
                value={newAddress.address2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, address2: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-city" className="mb-2 block">City</Label>
                <Input
                  id="new-city"
                  value={newAddress.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, city: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-state" className="mb-2 block">
                  State <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newAddress.state_id}
                  onValueChange={(value) => setNewAddress({...newAddress, state_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-zipcode" className="mb-2 block">ZIP Code</Label>
                <Input
                  id="new-zipcode"
                  value={newAddress.zipcode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, zipcode: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-phone" className="mb-2 block">Phone Number</Label>
                <Input
                  id="new-phone"
                  value={newAddress.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAddress({...newAddress, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="new-country" className="mb-2 block">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newAddress.country_id}
                  onValueChange={(value) => setNewAddress({...newAddress, country_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="new-address-type" className="mb-2 block">
                Address Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={newAddress.address_type}
                onValueChange={(value) => setNewAddress({...newAddress, address_type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  {ADDRESS_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="new-is-default"
                checked={newAddress.default}
                onCheckedChange={(checked) => setNewAddress({...newAddress, default: checked as boolean})}
              />
              <Label htmlFor="new-is-default" className="text-sm font-medium">
                Set as default {newAddress.address_type} address
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateAddress} 
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? 'Creating...' : 'Create Address'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {address.firstname} {address.lastname}
                    </h3>
                    {/* Address Type Tags */}
                    {(address as any).user_address && (
                      <div className="flex gap-1">
                        {(address as any).user_address.default_billing && (
                          <Badge variant="secondary" className="text-xs">
                            Billing
                          </Badge>
                        )}
                        {(address as any).user_address.default_shipping && (
                          <Badge variant="outline" className="text-xs">
                            Shipping
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.phone}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>{address.city}, {address.state_name} {address.zipcode}</p>
                <p>{address.country_name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Add an address for faster checkout</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      )}
    </Card>
  );
}

// Reviews Tab Component
function ReviewsTab({ reviews }: { reviews: any[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Product Reviews</h2>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Write Review
        </Button>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <img 
                  src={review.productImage} 
                  alt={review.productName}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{review.productName}</h3>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{review.comment}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{review.date}</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-4">Share your thoughts on products you've purchased</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Write Your First Review
          </Button>
        </div>
      )}
    </Card>
  );
}
