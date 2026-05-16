const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getMe,
  logout,
  updateProfile,
  changePassword,
} = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/admin/login', loginValidation, adminLogin);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
