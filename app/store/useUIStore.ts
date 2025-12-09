import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type Language = 'en' | 'es' | 'fr';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  title?: string; // optional
  autoDismiss?: boolean; // optional
};

type UIState = {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  cartOpen: boolean;
  searchOpen: boolean;
  hasHydrated: boolean;
  notifications: Notification[];
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  toggleCart: () => void;
  toggleSearch: () => void;
  setCartOpen: (open: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  addNotification: (type: NotificationType, message: string, autoDismiss?: boolean, title?: string) => void;
  removeNotification: (id: string) => void;
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light',
        language: 'en',
        sidebarOpen: false,
        cartOpen: false,
        searchOpen: false,
        hasHydrated: false,
        notifications: [],
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
        toggleCart: () => set({ cartOpen: !get().cartOpen }),
        toggleSearch: () => set({ searchOpen: !get().searchOpen }),
        setCartOpen: (cartOpen) => set({ cartOpen }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
        addNotification: (type, message, autoDismiss = false, title) => {
          const id = Math.random().toString(36).substr(2, 9);
          set({ 
            notifications: [...get().notifications, { id, type, message, title, autoDismiss }] 
          });
        },
        removeNotification: (id) => {
          set({ notifications: get().notifications.filter(n => n.id !== id) });
        },
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ 
          theme: state.theme, 
          language: state.language 
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'UIStore', // This is the devtools name
      enabled: true,   // Enable devtools
    }
  )
);
