const urls = require('../models/urlModel');
const generateShortCode = require('../utils/generateShortCode');
const Log = require('../utils/logger');

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    await Log("backend", "error", "controller", "Invalid URL provided.");
    return res.status(400).json({ error: 'Invalid URL' });
  }

  let code = shortcode || generateShortCode();

  if (urls.has(code)) {
    await Log("backend", "warn", "controller", "Shortcode already exists.");
    return res.status(409).json({ error: 'Shortcode already exists' });
  }

  const expiry = Date.now() + validity * 60 * 1000;
  urls.set(code, { longUrl: url, expiry });

  await Log("backend", "info", "controller", `Short URL created for code: ${code}`);
  return res.status(201).json({ shortUrl: `http://localhost:3000/${code}` });
};

exports.redirectToLongUrl = async (req, res) => {
  const { shortcode } = req.params;
  const data = urls.get(shortcode);

  if (!data) {
    await Log("backend", "warn", "controller", "Shortcode not found.");
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  if (Date.now() > data.expiry) {
    urls.delete(shortcode);
    await Log("backend", "warn", "controller", "Shortcode expired.");
    return res.status(410).json({ error: 'Link expired' });
  }

  await Log("backend", "info", "controller", `Redirecting to: ${data.longUrl}`);
  return res.redirect(data.longUrl);
};
