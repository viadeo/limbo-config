var debug = require('debug')('tetra:config');

/**
 * Require a module if it exists and is valid; otherwise, return false. This prevents
 * exceptions due to invalid JSON from being thrown.
 *
 * If an exception occurs, we log it
 *
 * @param name
 * @returns {*}
 */
exports.safeRequire = function (name) {
  var module;
  try {
    if (this.exists(name)) {
      module = require(name);
      return (typeof module !== 'undefined') ? module : false;
    }
  } catch (e) {
    // TODO Change to console log ?
    debug('There was a problem requiring module "%s", error: %s', name, e);
  }

  return false;
};

/**
 * Verify that a module exists
 *
 * @param name
 * @returns {*}
 */
exports.exists = function (name) {
  try {
    return require.resolve(name);
  } catch (e) {
    return false;
  }
};
