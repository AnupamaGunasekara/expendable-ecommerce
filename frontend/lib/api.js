import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add session ID for cart
      const sessionId = getSessionId();
      config.headers['x-session-id'] = sessionId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error);
    console.log('Error response:', error.response);
    console.log('Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      console.log('401 error on path:', currentPath);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Don't redirect on login pages
      if (currentPath === '/login' || currentPath === '/admin/login') {
        return Promise.reject(error);
      }
      
      // Redirect to appropriate login page
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Session ID management
const getSessionId = () => {
  // Return empty string if not in browser environment
  if (typeof window === 'undefined') {
    return '';
  }
  
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getFeatured: () => api.get('/products/featured'),
};

// Category APIs
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  getMain: () => api.get('/categories/main'),
};

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (itemId, data) => api.put(`/cart/${itemId}`, data),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Wishlist APIs
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  add: (productId) => api.post('/wishlist', { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
  check: (productId) => api.get(`/wishlist/check/${productId}`),
  
  // Sync local wishlist to server after login
  syncToServer: async (localWishlist) => {
    if (!localWishlist || localWishlist.length === 0) return;
    try {
      // Add each item from local storage to server
      for (const item of localWishlist) {
        try {
          await api.post('/wishlist', { productId: item.productId });
        } catch (error) {
          // Item might already exist, ignore error
          console.log('Item already in wishlist:', item.productId);
        }
      }
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    }
  },
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Coupon APIs
export const couponAPI = {
  validate: (data) => api.post('/coupons/validate', data),
};

// Contact APIs
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
};

// Newsletter APIs
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

// Settings APIs
export const settingsAPI = {
  getAll: () => api.get('/settings'),
  getByKey: (key) => api.get(`/settings/${key}`),
};

// Admin APIs
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}`, data),
  
  // Products
  getAllProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  updateStock: (variantId, stock) => api.put(`/admin/variants/${variantId}/stock`, { stock }),
  
  // Customers
  getAllCustomers: (params) => api.get('/admin/customers', { params }),
  
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  
  // Contact Messages
  getContactMessages: (params) => api.get('/admin/contact-messages', { params }),
  markMessageAsRead: (id) => api.put(`/admin/contact-messages/${id}/read`),
  
  // Coupons
  getAllCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  
  // Settings
  updateSetting: (data) => api.put('/admin/settings', data),
};

export default api;
