const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getAllCustomers,
  getContactMessages,
  markMessageAsRead,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  updateSetting,
  getAllCategoriesAdmin,
} = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware');
const { productValidation } = require('../middleware/validation.middleware');

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

// Products
router.get('/products', getAllProducts);
router.post('/products', productValidation, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.put('/variants/:variantId/stock', updateStock);

// Customers
router.get('/customers', getAllCustomers);

// Contact Messages
router.get('/contact-messages', getContactMessages);
router.put('/contact-messages/:id/read', markMessageAsRead);

// Coupons
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);

// Settings
router.put('/settings', updateSetting);

// Categories
router.get('/categories', getAllCategoriesAdmin);

module.exports = router;
