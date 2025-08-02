/**
 * @fileoverview AppError: A custom error class for handling operational errors.
 * @description This class extends the built-in Error class to provide standardized error handling
 * with status codes, error status, and a flag to differentiate operational from programming errors.
 */
class AppError extends Error {
  /**
   * @description Creates a new AppError instance.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    // Call the parent constructor (Error) with the message.
    super(message);

    // Assign the HTTP status code to the error instance.
    this.statusCode = statusCode;
    // Determine the error status based on the status code.
    // Errors starting with '4' are client-side failures, while others are server-side errors.
    this.status = `${statusCode}`.startsWith(4) ? "fail" : "error";
    // Mark this as an operational error, meaning it is a predictable error that we can handle.
    this.isOperational = true;

    // Capture the stack trace to correctly pinpoint where the error occurred.
    // This prevents the constructor itself from showing up in the stack trace.
    Error.captureStackTrace(this, this.constructor);
  }
}

// Export the custom AppError class for use in other parts of the application.
module.exports = AppError;
