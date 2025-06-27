const express = require('express');
const router = express.Router();

const {
  createShortUrl,
  redirectToLongUrl,
  getStats  
} = require('../controllers/urlController');

router.post('/shorturls', createShortUrl);
router.get('/:shortcode', redirectToLongUrl);
router.get('/shorturls/:shortcode/stats', getStats); // ⬅️ This must come after the redirect route

module.exports = router;
