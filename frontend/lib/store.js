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

// Wishlist Store with localStorage support for non-logged-in users
export const useWishlistStore = create((set, get) => ({
  items: [],
  
  // Initialize wishlist from localStorage
  init: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        try {
          const items = JSON.parse(stored);
          set({ items });
        } catch (e) {
          console.error('Failed to parse wishlist from localStorage');
        }
      }
    }
  },
  
  // Save to localStorage
  saveToStorage: (items) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(items));
    }
  },
  
  setItems: (items) => {
    const itemsArray = items || [];
    set({ items: itemsArray });
    get().saveToStorage(itemsArray);
  },
  
  addItem: (product) => {
    const state = get();
    const exists = state.items.some(item => item.productId === product.productId);
    if (!exists) {
      const newItems = [...state.items, product];
      set({ items: newItems });
      state.saveToStorage(newItems);
    }
  },
  
  removeItem: (productId) => {
    const state = get();
    const newItems = state.items.filter((item) => item.productId !== productId);
    set({ items: newItems });
    state.saveToStorage(newItems);
  },
  
  isInWishlist: (productId) => {
    const state = get();
    return state.items?.some((item) => item.productId === productId) || false;
  },
  
  // Clear wishlist
  clear: () => {
    set({ items: [] });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wishlist');
    }
  },
  
  // Get wishlist from localStorage
  getLocalWishlist: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
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
