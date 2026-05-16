const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductBySlug,
  getProductById,
  searchProducts,
  getFeaturedProducts,
} = require('../controllers/product.controller');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

module.exports = router;
