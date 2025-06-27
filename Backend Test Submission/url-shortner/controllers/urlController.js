const urls = require('../models/urlModel');
const generateShortCode = require('../utils/generateShortCode');

exports.createShortUrl = (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    let code = shortcode || generateShortCode();
    if (urls.has(code)) {
        return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const expiry = Date.now() + validity * 60 * 1000;

    urls.set(code, { longUrl: url, expiry });
    return res.status(201).json({ shortUrl: `http://localhost:3000/${code}` });
};

exports.redirectToLongUrl = (req, res) => {
    const { shortcode } = req.params;
    const data = urls.get(shortcode);

    if (!data) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (Date.now() > data.expiry) {
        urls.delete(shortcode);
        return res.status(410).json({ error: 'Link expired' });
    }

    return res.redirect(data.longUrl);
};
