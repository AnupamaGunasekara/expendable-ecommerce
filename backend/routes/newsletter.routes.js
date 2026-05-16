const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe } = require('../controllers/newsletter.controller');
const { newsletterValidation } = require('../middleware/validation.middleware');

router.post('/subscribe', newsletterValidation, subscribe);
router.post('/unsubscribe', newsletterValidation, unsubscribe);

module.exports = router;
