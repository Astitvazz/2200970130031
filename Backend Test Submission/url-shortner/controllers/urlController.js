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
 urls.set(code, {
  longUrl: url,
  expiry,
  createdAt: Date.now(),
  clicks: 0,
  clickLogs: []
});


  await Log("backend", "info", "controller", `Short URL created for code: ${code}`);
  return res.status(201).json({ shortUrl: `http://localhost:3000/${code}` });
};

 const getLocationFromIP = require('../utils/ipLocation');

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

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const location = await getLocationFromIP(ip); // e.g., "India" or "US"

  data.clicks = (data.clicks || 0) + 1;
  data.clickLogs = data.clickLogs || [];
  data.clickLogs.push({
    timestamp: Date.now(),
    ip,
    location
  });

  await Log("backend", "info", "controller", `Redirected to ${data.longUrl}`);
  return res.redirect(data.longUrl);

};


exports.getStats = async (req, res) => {
  const { shortcode } = req.params;
  const data = urls.get(shortcode);

  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  const stats = {
    shortcode,
    originalUrl: data.longUrl,
    createdAt: new Date(data.createdAt).toISOString(),
    expiry: new Date(data.expiry).toISOString(),
    totalClicks: data.clicks || 0,
    clickDetails: data.clickLogs || []
  };

  await Log("backend", "info", "controller", `Stats fetched for ${shortcode}`);
  return res.status(200).json(stats);
};



