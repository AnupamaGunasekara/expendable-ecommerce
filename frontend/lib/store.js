import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      login: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Cart Store
export const useCartStore = create((set, get) => ({
  cart: { items: [] },
  total: 0,
  itemCount: 0,
  isOpen: false,
  
  setCart: (cart, total) => {
    const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    set({ cart, total, itemCount });
  },
  
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Wishlist Store
export const useWishlistStore = create((set, get) => ({
  items: [],
  setItems: (items) => set({ items: items || [] }),
  addItem: (product) => set((state) => ({
    items: [...state.items, product],
  })),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.productId !== productId),
  })),
  isInWishlist: (productId) => {
    const state = get();
    return state.items?.some((item) => item.productId === productId) || false;
  },
}));

// UI Store
export const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
}));
