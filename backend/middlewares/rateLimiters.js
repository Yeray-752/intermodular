import rateLimit
 from "express-rate-limit";
export const loginLimiter = rateLimit({
  windowMs: 60 * 30 * 1000,
  max: 5, //5 intentos cada media hora
 handler: (req, res) => {
    res.status(429).json({
      message: 'Has fallado demasiadas veces, por favor, inténtelo más tarde.'
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});