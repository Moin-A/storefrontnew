import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {Order, OrderDetails} from '../types/solidus'
import { ShippingMethod } from '../types/solidus';

type OrderState = {
  orders: Order[];
  shippingData: { shipping_methods?: Array<ShippingMethod> } ;
  currentOrder: OrderDetails | null;
  hasHydrated: boolean;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: number, orderData: Partial<Order>) => void;
  setCurrentOrder: (order: OrderDetails | null) => void;
  clearOrders: () => void;
  setHasHydrated: (value: boolean) => void;
  fetchOrder: () => void;
  fetchShippingMethods: () => void;
  fetchCurrentOrder: () => void;
};

export const useOrderStore = create<OrderState>()(
  devtools(
    persist(
      (set, get) => ({
        orders: [],
        currentOrder: null,
        hasHydrated: false,
        shippingData: { shipping_methods: [] },
        setOrders: (orders) => set({ orders }),
        addOrder: (order) => {
          const { orders } = get();
          set({ orders: [...orders, order] });
        },
        updateOrder: (orderId, orderData) => {
          const { orders, currentOrder } = get();
          const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, ...orderData } : order
          );
          
          set({
            orders: updatedOrders,
            currentOrder: currentOrder?.id === orderId 
              ? { ...currentOrder, ...orderData }
              : currentOrder
          });
        },
        fetchOrder: async () => {
          const response = await fetch('/api/users/orders');
          set({ orders: await response.json() });
        },
        fetchCurrentOrder: async () => {
          const response = await fetch('/api/orders/current');
          set({ currentOrder: await response.json() });
        },
        fetchShippingMethods: async () => {
          const response = await fetch(`/api/users/orders/current/shipping_methods`);
          set({ shippingData: await response.json() });
        },
        setCurrentOrder: (currentOrder) => set({ currentOrder }),
        clearOrders: () => set({ orders: [], currentOrder: null }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: 'order-storage',
        partialize: (state) => ({ 
          orders: state.orders, 
          currentOrder: state.currentOrder 
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'OrderStore',
      enabled: true,
    }
  )
);
