import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 60 * 30 * 1000,
  max: 3000,
 handler: (req, res) => {
    res.status(429).json({
      message: 'Has fallado demasiadas veces, por favor, inténtelo más tarde.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter  = rateLimit({
  windowMs: 60 * 30 * 1000,
  max: 30,
 handler: (req, res) => {
    res.status(429).json({
      message: 'Has fallado demasiadas veces, por favor, inténtelo más tarde.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});