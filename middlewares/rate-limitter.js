const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 100 requests per 5 minutes
  max: 100,
});

module.exports = limiter;
