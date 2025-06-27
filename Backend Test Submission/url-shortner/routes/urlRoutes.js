const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToLongUrl } = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/:shortcode', redirectToLongUrl);

module.exports = router;
