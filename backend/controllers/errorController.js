/**
 * @fileoverview Global Error Handler: Centralized error handling for the application, with different responses for development and production environments.
 */
const AppError = require("../utils/appError");

/**
 * @description Send detailed error response in the development environment.
 * @param {object} err - The error object.
 * @param {object} res - The Express response object.
 */
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // The full error object is often shown in development for easier debugging.
    message: err.message,
    stack: err.stack,
  });
};

/**
 * @description Send a concise error response in the production environment, hiding sensitive details.
 * @param {object} err - The error object.
 * @param {object} res - The Express response object.
 */
const sendErrPro = (err, res) => {
  // Operational errors (e.g., invalid user input) get a detailed message.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programing errors or unknown errors are logged and a generic message is sent.
    console.error(`ERROR⛔: `, err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong O.O",
    });
  }
};

/**
 * @description Handle Mongoose CastError (e.g., invalid object ID).
 * @param {object} err - The original CastError object.
 * @returns {AppError} A new operational AppError instance.
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * @description Handle MongoDB duplicate key errors (code 11000).
 * @param {object} err - The original error object.
 * @returns {AppError} A new operational AppError instance.
 */
const handlePuplicateFieldsDB = (err) => {
  const duplicateKey = err.keyValue ? Object.keys(err.keyValue)[0] : "field";
  const duplicateValue = err.keyValue
    ? Object.values(err.keyValue)[0]
    : "value";
  const message = `Duplicate field value: "${duplicateValue}" for ${duplicateKey}. Please use another value.`;
  return new AppError(message, 400);
};

/**
 * @description Handle Mongoose validation errors.
 * @param {object} error - The original ValidationError object.
 * @returns {AppError} A new operational AppError instance.
 */
const handleWrongValueDB = (error) => {
  const message = `Invalid input data: ${error.message
    .match(/(?<=:).*/)[0]
    .match(/(?<=:).*/)[0]
    .trim()}`;
  return new AppError(message, 400);
};

/**
 * @description Global error handling middleware.
 * @param {object} err - The error object.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - The next middleware function.
 */
module.exports = (err, req, res, next) => {
  // 1. Set default status code and status for the error.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 2. Handle errors based on the environment (development vs. production).
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
    return; // Stop further execution.
  } else if (process.env.NODE_ENV === "production") {
    // Create a copy of the error to avoid modifying the original.
    let error = { ...err };

    // Handle specific error types and convert them to operational errors.
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handlePuplicateFieldsDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleWrongValueDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrPro(error, res);
    return; // Stop further execution.
  }

  // Fallback for any unhandled errors.
  res.status(err.statusCode).json({
    status: err.status,
    message: `${err.message} ⛔from global handler`,
  });
};
