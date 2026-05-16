const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} = require('../controllers/order.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { orderValidation } = require('../middleware/validation.middleware');

// All order routes require authentication
router.post('/', authMiddleware, orderValidation, createOrder);
router.get('/', authMiddleware, getUserOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/cancel', authMiddleware, cancelOrder);

module.exports = router;
