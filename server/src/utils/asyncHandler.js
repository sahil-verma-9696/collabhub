/**
 * Async Handler Utility
 * Wraps async controllers to auto-forward errors to Express error middleware
 */

export default function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}