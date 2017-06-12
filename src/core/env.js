/**
 * Node modules
 */
const dotenv = require('dotenv');
const assert = require('assert');

dotenv.config({ path: 'variables.env' });

/**
 * Gets env variables by its name. These variables are
 * extracted by dotenv lib.
 *
 * @package Core
 * @author Patrick Ferreira <paatrickferreira@gmail.com>
 */
exports.getEnvProp = function (prop) {
  const result = process.env[prop];
  assert(typeof result !== 'undefined', `Please provide ${prop} in the .env file!`);

  return result;
};
