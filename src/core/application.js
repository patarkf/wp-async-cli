/**
 * Local modules
 */
const WP = require('./wp-cli');
const Logger = require('../utils/logger');

/**
 * Application class
 *
 * @package Core
 * @author Patrick Ferreira <paatrickferreira@gmail.com>
 */
class Application {

  /**
   * Example function used to recount a number of terms of a specific taxonomy.
   *
   * @returns {any}
   * @memberof Application
   */
  static async test() {
    try {
      const createdPostsIds = await WP.generateRandomPosts(4, { post_status: 'publish', post_type: 'page' });
      Logger.info(`The posts with the following ids were created: ${createdPostsIds}`);
    } catch (err) {
      Logger.error(err);
    }
  }
}

module.exports = Application;
