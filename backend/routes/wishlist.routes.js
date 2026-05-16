const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require('../controllers/wishlist.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All wishlist routes require authentication
router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addToWishlist);
router.delete('/:productId', authMiddleware, removeFromWishlist);
router.get('/check/:productId', authMiddleware, checkWishlist);

module.exports = router;
