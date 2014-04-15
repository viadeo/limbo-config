var debug = require('debug')('tetra:config'),
  path = require('path'),
  fs = require('fs'),
  convict = require('convict'),
  _ = require('lodash'),
  schema = require('./schema'),
  utils = require('./utils'),
  ConfigurationError = require('./errors/ConfigurationError');

/**
 * Merges together the environment and global configurations and returns the
 * merged JSON object.
 *
 * @returns {validate|*|validate}
 * @private
 */
var env = process.env.NODE_ENV || 'development',
  configPath = path.resolve(process.cwd(), 'config'),
  globalConfig = utils.safeRequire(configPath + '/environments/all/config.json'),
  envConfig = utils.safeRequire(configPath + '/environments/' + env + '/config.json'),
  appSchema = utils.safeRequire(configPath + '/convict/schema.json'),
  rootConfig = {}, config, bowerConfig;

try {
  if (appSchema) {
    debug('Found application Convict schema');
    _.merge(schema, appSchema);
  }

  config = convict(schema);
  config.load(globalConfig || {});
  config.load(envConfig || {});

  config.validate();
  rootConfig = config.root();

  // Override the external components directory
  try {
    bowerConfig = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.bowerrc')));
    rootConfig.tetra.external_components = bowerConfig.directory;
  } catch (e) {
    // Nothing to do, use the default value
  }
} catch (e) {
  throw new ConfigurationError(e.message);
}

module.exports = rootConfig;
