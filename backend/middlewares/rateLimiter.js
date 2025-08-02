/**
 * @fileoverview Rate Limiting Middleware: Configures and exports rate limiters for API endpoints.
 * @description This file prevents abuse of API endpoints by limiting the number of requests a user can make in a given time frame.
 */
const rateLimit = require("express-rate-limit");

/**
 * @description Rate limiter for all API endpoints that provide R2 URLs (e.g., articles, images, videos).
 * @param {object} options - Configuration object for the rate limiter.
 * @param {number} options.windowMs - The time window in milliseconds.
 * @param {number} options.max - The maximum number of requests allowed per IP address within the window.
 * @param {boolean} options.standardHeaders - Enable `RateLimit` and `Retry-After` headers.
 * @param {boolean} options.legacyHeaders - Disable `X-RateLimit-*` headers.
 * @param {string} options.message - The message sent when the rate limit is exceeded.
 */
exports.r2UrlAccessLimiter = rateLimit({
  // Time window for requests (15 minutes).
  windowMs: 15 * 60 * 1000,
  // Maximum number of requests per IP in the time window.
  max: 40,
  // Use standard rate limit headers.
  standardHeaders: true,
  // Disable legacy headers for cleaner responses.
  legacyHeaders: false,
  // Custom message to send when the limit is exceeded.
  message:
    "Too many requests for file access, please try again after 15 minutes.",
});
