const express = require('express');
const router = express.Router();
const { getSettings, getSetting } = require('../controllers/settings.controller');

router.get('/', getSettings);
router.get('/:key', getSetting);

module.exports = router;
