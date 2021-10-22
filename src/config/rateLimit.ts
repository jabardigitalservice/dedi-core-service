import rateLimit from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 600000, // 10 minutes
  max: 100
});

export const auth = rateLimit({
  windowMs: 5000, // 5 seconds
  max: 5
});
