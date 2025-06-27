module.exports = function logger(req, res, next) {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
    // Custom logger: store to file or console (not `console.log`)
    require('fs').appendFileSync('logs.txt', log + '\n');
    next();
};
