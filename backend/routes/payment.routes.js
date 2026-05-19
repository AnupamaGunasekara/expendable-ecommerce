const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
  initiatePayment,
  handleNotify,
  getPaymentStatus,
} = require('../controllers/payment.controller');

// JWT-protected: customer initiates a card payment after order is created
router.post('/initiate', authMiddleware, initiatePayment);

// PayHere server-to-server webhook — NO auth middleware (called by PayHere, not the browser)
// Must be reachable from the public internet in production.
router.post('/notify', handleNotify);

// JWT-protected: frontend polls payment outcome after returning from PayHere
router.get('/status/:orderNumber', authMiddleware, getPaymentStatus);

module.exports = router;
