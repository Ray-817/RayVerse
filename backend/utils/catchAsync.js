/**
 * @fileoverview Catch Async Utility: A higher-order function to handle errors in async route handlers.
 * @description This utility wraps an asynchronous function, catching any errors and passing them to the next middleware.
 */
// eslint-disable-next-line arrow-body-style
/**
 * @description A higher-order function to catch errors in async functions.
 * @param {Function} fn - The asynchronous function (route handler) to be wrapped.
 * @returns {Function} A new function that executes the original function and catches any errors.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    // Execute the async function and catch any potential errors.
    // If an error occurs, it will be automatically passed to the next error-handling middleware.
    fn(req, res, next).catch(next);
  };
};
