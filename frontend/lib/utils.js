// Format currency to LKR
export const formatPrice = (price) => {
  return `Rs. ${parseFloat(price).toLocaleString('en-LK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// Calculate discount percentage
export const calculateDiscount = (price, salePrice) => {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
};

// Generate product URL
export const getProductUrl = (slug) => `/products/${slug}`;

// Generate category URL
export const getCategoryUrl = (slug) => `/shop/${slug}`;

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate order status badge color
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get available sizes from variants
export const getAvailableSizes = (variants) => {
  return [...new Set(variants.map((v) => v.size))];
};

// Get available colors from variants
export const getAvailableColors = (variants) => {
  const colors = variants.map((v) => ({
    name: v.color,
    hex: v.colorHex,
  }));
  return Array.from(new Map(colors.map((c) => [c.name, c])).values());
};

// Check if product is in stock
export const isInStock = (variants) => {
  return variants.some((v) => v.stock > 0 && v.isActive);
};

// Get product badge
export const getProductBadge = (product) => {
  if (product.onSale) return { text: 'Sale', color: 'bg-red-500' };
  if (product.isNew) return { text: 'New', color: 'bg-green-500' };
  if (product.isBestSeller) return { text: 'Best Seller', color: 'bg-blue-500' };
  return null;
};
