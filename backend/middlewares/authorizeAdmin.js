/**
 * @fileoverview Authorization Middleware: Ensures that only authorized requests can modify data.
 */
const API_TOKEN = process.env.API_TOKEN;

/**
 * @description Middleware to authorize administrative access based on a bearer token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 */
const authorizeAdmin = (req, res, next) => {
  // 1. Allow all GET and OPTIONS requests to pass without authentication.
  if (req.method === "GET" || req.method === "OPTIONS") {
    return next();
  }

  // 2. Get the authorization token from the request headers.
  const token = req.headers["authorization"];

  // Handle case where no token is provided.
  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }

  // 3. Validate the token format (should be "Bearer <token>").
  const parts = token.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Authorization token format is invalid (e.g., Bearer <token>).",
    });
  }

  // 4. Extract and compare the token.
  const actualToken = parts[1];

  if (actualToken === API_TOKEN) {
    next(); // Token matches, proceed to the next middleware/route handler.
  } else {
    // Token does not match, return a 403 Forbidden error.
    res.status(403).json({ message: "Invalid API token." });
  }
};

module.exports = authorizeAdmin;
