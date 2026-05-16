const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cart.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

// Cart routes (works with or without auth)
router.get('/', optionalAuth, getCart);
router.post('/', optionalAuth, addToCart);
router.put('/:itemId', optionalAuth, updateCartItem);
router.delete('/:itemId', optionalAuth, removeFromCart);
router.delete('/', optionalAuth, clearCart);

module.exports = router;
