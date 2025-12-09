import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Address, User } from '../types/solidus';
type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  Defaultaddress: Array<object>;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  clearUser: () => void;
  setHasHydrated: (value: boolean) => void;
  fetchDefaultAddress: () => void;
  setDefaultAddress: (addresses: Address) => void;
};

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        hasHydrated: false,
        Defaultaddress: [],
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        setDefaultAddress: (addresses) => set({Defaultaddress: addresses}),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        clearUser: () => set({ user: null, isAuthenticated: false }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
        fetchDefaultAddress: async () => {
            const addressesResponse = await fetch('/api/addresses');
            const Defaultaddress = await addressesResponse.json();
            set({ Defaultaddress });
        }
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated 
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'UserStore',
      enabled: true,
    }
  )
);
