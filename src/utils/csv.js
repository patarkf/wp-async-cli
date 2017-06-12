/**
 * Local modules
 */
const Logger = require('./logger');

/**
 * Node modules
 */
const util = require('util');
const csv = util.promisify(require('fast-csv'));

/**
 * Wrapper for the Fast Csv module. Main responsibility is to read
 * csv files, convert it properly and return the extracted data
 * to its invoker.
 *
 * @author Patrick Ferreira <paatrickferreira@gmail.com>
 * @class CsvParser
 */
class CsvParser {

  /**
   * Reads content from a given CSV file.
   *
   * @param {any} filename
   * @returns {object}
   *
   * @memberof CsvParser
   */
  static getCsvContent(filename) {
    return new Promise((resolve, reject) => {
      csv.fromPath(`./data/${filename}`)
        .on('data', (data) => {
          Logger.info(`Reading ${filename} file...`);

          if (!data.length) reject('No data found');

          resolve(data);
        });
    });
  }
}

module.exports = new CsvParser();
