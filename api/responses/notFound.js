/**
 * Module dependencies
 */

// n/a

/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound(err);
 *
 * e.g.:
 * ```
 * return res.notFound();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 */

module.exports = function notFound(err) {
  // Get access to `req` and `res`
  const {req, res} = this;

  // Get access to `sails`
  const sails = req._sails;

  const error = {
    error: err,
  };

  // Set status code
  res.status(404);

  return res.json(error);
};
