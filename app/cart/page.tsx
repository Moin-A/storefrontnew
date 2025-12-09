'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SOLIDUS_ROUTES } from '../../lib/routes';
import { Cart, LineItem } from '../types/solidus';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '../store/userStore';

export default function CartPage() {
    const router = useRouter();
    const { cart, fetchCart,setCart } = useCartStore();
    const { fetchDefaultAddress } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

    useEffect(() => {
        setLoading(true);
        const loadCart = async () => {
            await fetchCart();
            await fetchDefaultAddress();
            setLoading(false);
        };
        loadCart();
    }, []);

    

    const updateQuantity = async (lineItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(lineItemId));
        
        try {
            const response = await fetch(`/api/cart/update/${lineItemId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                const updatedLineItem = await response.json();
                // Update the specific line item in the existing cart instead of replacing the entire cart
                if (cart?.line_items) {
                    const updatedLineItems = cart.line_items.map(item => 
                        item.id === lineItemId 
                            ? { ...item, quantity: newQuantity, total: updatedLineItem.total || item.total }
                            : item
                    );
                    setCart({
                        ...cart,
                        line_items: updatedLineItems,
                        item_count: updatedLineItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
                    });
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(lineItemId);
                return newSet;
            });
            fetchCart();
        }
    };

    const removeItem = async (lineItemId: number) => {
        setUpdatingItems(prev => new Set(prev).add(lineItemId));
        
        try {
            const response = await fetch(`/api/cart/remove/${lineItemId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove the item from the existing cart instead of replacing the entire cart
                if (cart?.line_items) {
                    const updatedLineItems = cart.line_items.filter(item => item.id !== lineItemId);
                    setCart({
                        ...cart,
                        line_items: updatedLineItems,
                        item_count: updatedLineItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
                    });
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(lineItemId);
                return newSet;
            });
        }
        fetchCart()
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading your cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || !cart.line_items || cart.line_items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                        <h2 className="mt-6 text-2xl font-light text-gray-900">
                            Your cart is empty
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Add some items to your cart to get started
                        </p>
                        <div className="mt-8">
                            <Link href="/">
                                <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 py-3">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-light text-gray-900 mb-12 text-center lg:text-left">Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h2 className="text-xl font-medium text-gray-900">
                                {cart.item_count || 0} {cart.item_count === 1 ? 'item' : 'items'}
                            </h2>
                        </div>
                        <div className="p-8">
                            <div className="space-y-8">
                                {cart.line_items.map((item: LineItem, index) => {
                                    const isUpdating = updatingItems.has(item.id!);
                                    const imageUrl = item.variant?.product?.images?.[0]?.attachment_url || 
                                                   item.variant?.product?.images?.[0]?.url || 
                                                   '/placeholder.svg';
                                    return (
                                        <div key={item.id}>
                                            <div
                                                className={`flex gap-6 p-6 bg-gray-50 rounded-xl transition-all duration-200 ${
                                                    isUpdating ? 'opacity-50' : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-white shadow-sm">
                                                        <Image
                                                            src={imageUrl}
                                                            alt={item.variant?.product?.name || 'Product'}
                                                            fill
                                                            className="object-cover"
                                                            unoptimized={imageUrl.includes('cloudfront.net')}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-lg text-gray-900 truncate">
                                                        {item.variant?.product?.name || 'Product'}
                                                    </h3>
                                                    {item.variant?.name && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {item.variant.name}
                                                        </p>
                                                    )}
                                                    {item.variant?.sku && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            SKU: {item.variant.sku}
                                                        </p>
                                                    )}
                                                    <p className="mt-3 font-semibold text-gray-900 text-lg">
                                                        ${item.price}
                                                    </p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex flex-col items-end gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id!, item.quantity! - 1)}
                                                            disabled={isUpdating || item.quantity === 1}
                                                            className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                                        >
                                                            −
                                                        </Button>
                                                        <span className="w-8 text-center font-medium text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.id!, item.quantity! + 1)}
                                                            disabled={isUpdating}
                                                            className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                    
                                                    {/* Line Total */}
                                                    <p className="font-semibold text-xl text-gray-900">
                                                        ${item?.price * item?.quantity}
                                                    </p>

                                                    {/* Remove Button */}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => removeItem(item.id!)}
                                                        disabled={isUpdating}
                                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 px-3 py-1 text-sm"
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                            {index < (cart.line_items?.length || 0) - 1 && (
                                                <div className="mt-8 border-b border-gray-200"></div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Continue Shopping Link */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <Link href="/">
                                    <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400">
                                        ← Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sticky top-8">
                        <h3 className="text-xl font-medium text-gray-900 mb-6">Summary</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium text-gray-900">${cart.item_total}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-gray-900">{cart.ship_total}</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium text-gray-900">$0.00</span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">${cart.total}</span>
                                </div>
                            </div>

                            <Button 
                                className="w-full mt-6 bg-black hover:bg-gray-800 text-white rounded-xl py-4 text-base font-medium transition-all duration-200" 
                                size="lg"
                                onClick={async () => {
                                    // Only call API if cart state is "Cart"
                                    if (cart?.state === 'cart' || cart?.state === 'Cart') {
                                        try {
                                            const response = await fetch(SOLIDUS_ROUTES.api.checkout_next(cart?.number), {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: 'include'
                                            });

                                            if (response.ok) {
                                                // Refresh cart to get updated state
                                                await fetchCart();
                                                router.push(SOLIDUS_ROUTES.frontend.checkout);
                                            } else {
                                                console.error('Failed to advance checkout');
                                            }
                                        } catch (error) {
                                            console.error('Error advancing checkout:', error);
                                        }
                                    } else {
                                        // If not in cart state, just navigate
                                        router.push(SOLIDUS_ROUTES.frontend.checkout);
                                    }
                                }}
                            >
                                Checkout →
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4">
                                Shipping and taxes calculated at checkout
                            </p>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

