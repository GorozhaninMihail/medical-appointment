/**
 * Module dependencies
 */

// n/a



/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 *
 * e.g.:
 * ```
 * return res.forbidden();
 * ```
 */

module.exports = function forbidden (err) {

  // Get access to `res`
  let res = this.res;
  res.status(403);

  let error = {
    error: err
  };

  return res.json(error);

};
