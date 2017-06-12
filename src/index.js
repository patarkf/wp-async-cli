/**
 * Local modules
 */
const Application = require('./core/application');
const Logger = require('./utils/logger');

/**
 * Main function, responsible for initializing the application.
 *
 */
async function initialize() {
  try {
    await Application.test();
  } catch (err) {
    Logger.error(err);
  }
}

initialize();
