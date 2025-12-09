import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type Product = {
  id?: number;
  name?: string;
  slug?: string;
  description?: string;
  price?: string;
  available_on?: string;
  meta_description?: string;
  meta_keywords?: string;
  variants?: Array<{
    id?: number;
    sku?: string;
    price?: string;
    weight?: string;
    height?: string;
    width?: string;
    depth?: string;
    is_master?: boolean;
    in_stock?: boolean;
  }>;
  images?: Array<{
    id?: number;
    alt?: string;
    attachment_file_name?: string;
    attachment_url?: string;
  }>;
};

type ProductState = {
  products: {products: Product[]};
  currentProduct: Product | null;
  wishlist: Product[];
  hasHydrated: boolean;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  setCurrentProduct: (product: Product | null) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearProducts: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useProductStore = create<ProductState>()(
  devtools(
    persist(
      (set, get) => ({
        products: [],
        currentProduct: null,
        wishlist: [],
        hasHydrated: false,
        setProducts: (products) => set({ products }),
        addProduct: (product) => {
          const { products } = get();
          set({ products: [...products, product] });
        },
        setCurrentProduct: (currentProduct) => set({ currentProduct }),
        addToWishlist: (product) => {
          const { wishlist } = get();
          const exists = wishlist.find(item => item.id === product.id);
          if (!exists) {
            set({ wishlist: [...wishlist, product] });
          }
        },
        removeFromWishlist: (productId) => {
          const { wishlist } = get();
          set({ wishlist: wishlist.filter(item => item.id !== productId) });
        },
        clearProducts: () => set({ products: [], currentProduct: null }),
        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: 'product-storage',
        partialize: (state) => ({ 
          wishlist: state.wishlist,
          currentProduct: state.currentProduct 
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    {
      name: 'ProductStore',
      enabled: true,
    }
  )
);
