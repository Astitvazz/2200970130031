const Log = require('../utils/logger'); // we'll put Log in utils/logger.js

module.exports = async function customLogger(req, res, next) {
  try {
    await Log("backend", "info", "middleware", `${req.method} ${req.originalUrl} accessed`);
  } catch (err) {
    console.error("Logging failed in middleware:", err.message);
  }
  next();
};
