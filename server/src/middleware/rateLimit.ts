import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.SKIP_AUTH_RATE_LIMIT ? 10_000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts. Please try again later." },
  skip: () => Boolean(process.env.SKIP_AUTH_RATE_LIMIT),
});
