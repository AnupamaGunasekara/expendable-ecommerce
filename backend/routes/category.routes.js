const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryBySlug,
  getMainCategories,
} = require('../controllers/category.controller');

// Public routes
router.get('/', getAllCategories);
router.get('/main', getMainCategories);
router.get('/:slug', getCategoryBySlug);

module.exports = router;
