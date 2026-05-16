const express = require('express');
const router = express.Router();
const { submitContactMessage } = require('../controllers/contact.controller');
const { contactValidation } = require('../middleware/validation.middleware');

router.post('/', contactValidation, submitContactMessage);

module.exports = router;
