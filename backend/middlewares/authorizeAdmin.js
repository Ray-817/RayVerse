// backend/middleware/auth.js
const API_TOKEN = process.env.API_TOKEN;

const authorizeAdmin = (req, res, next) => {
  // GET 请求直接放行
  if (req.method === "GET") {
    return next();
  }

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }

  const parts = token.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Authorization token format is invalid (e.g., Bearer <token>).",
    });
  }

  const actualToken = parts[1];

  if (actualToken === API_TOKEN) {
    next(); // Token 匹配，继续处理请求
  } else {
    res.status(403).json({ message: "Invalid API token." }); // Token 不匹配
  }
};

module.exports = authorizeAdmin;
