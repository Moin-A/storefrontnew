import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import {Cart} from '../types/solidus';

type CartState = {
  cart: Cart | null;
  hasHydrated: boolean;
  setCart: (cart: Cart | null) => void;
  updateQuantity: (lineItemId: number, quantity: number) => void;
  removeItem: (lineItemId: number) => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
  fetchCart: () => void;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: null,
        hasHydrated: false,
        setCart: (cart) => set({ cart }),
        updateQuantity: (lineItemId, quantity) => {
          const { cart } = get();
          if (!cart?.line_items) return;
          
          const updatedItems = cart.line_items.map(item =>
            item.id === lineItemId ? { ...item, quantity } : item
          );
          
          set({
            cart: {
              ...cart,
              line_items: updatedItems,
              item_count: updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
            }
          });
        },
        removeItem: (lineItemId) => {
          const { cart } = get();
          if (!cart?.line_items) return;
          
          const updatedItems = cart.line_items.filter(item => item.id !== lineItemId);
          
          set({
            cart: {
              ...cart,
              line_items: updatedItems,
              item_count: updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
            }
          });
        },
        clearCart: () =>{ 
          set({ cart: null })
          localStorage.removeItem('cart-storage')
        },
        setHasHydrated: (value) => set({ hasHydrated: value }),
        fetchCart: async () => {
          try {
            const response = await fetch('/api/cart');
            if (response.ok) {
              const data = await response.json();
              set({ cart: data });
            }
          } catch (error) {
            console.error('Error fetching cart:', error);
          }
        }
      }),
      {
        name: 'cart-storage',
        partialize: (state) => ({ cart: state.cart }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'CartStore',
      enabled: true,
    }
  )
);
