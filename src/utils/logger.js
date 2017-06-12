/**
 * Node modules
 */
const winston = require('winston');

/**
 * Wrapper for the Winston logger.
 *
 * @author Patrick Ferreira <paatrickferreira@gmail.com>
 * @class Logger
 */
class Logger {

	/**
	 * Creates an instance of Logger.
	 *
	 * @memberof Logger
	 */
  constructor() {
    const logger = new (winston.Logger)({
      transports: [new (winston.transports.Console)({ level: 'debug', colorize: true })],
    });

    return logger;
  }
}

module.exports = new Logger();
