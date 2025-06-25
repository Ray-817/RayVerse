const rateLimit = require("express-rate-limit");

// 针对所有获取 R2 URL 的 API 的通用频率限制
// 你可以根据实际情况调整 `max` 和 `windowMs`
exports.r2UrlAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Too many requests for file access, please try again after 15 minutes.",
});
