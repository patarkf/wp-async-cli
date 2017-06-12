/**
 * Local modules
 */
const Environment = require('./env');
const Logger = require('../utils/logger');

/**
 * Node modules
 */
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/**
 * WordPress Command Line Wrapper Class.
 *
 * @class WP
 * @author Patrick Ferreira <paatrickferreira@gmail.com>
 */
class WP {

  /**
   * Creates an instance of WP.
   *
   * @memberof WP
   */
  constructor() {
    this.skipArgs = Environment.getEnvProp('SKIP_ARGS');
    this.path = Environment.getEnvProp('WP_PATH');
  }

  /**
   * Creates a post.
   *
   * @param {any} post
   * @param {any} fields
   *
   * @memberof WP
   */
  async createPost(post = {}) {
    const formattedFields = Object.keys(post).reduce((previous, key) => `${previous} --${key}='${post[key]}' `, '');

    const command = `wp post create ${formattedFields} --porcelain`;

    const postId = parseInt(await this.executeCommand(command), 10);

    Logger.info(`Created post with post id ${postId}`);

    return postId;
  }

  /**
   * Deletes a specific post by a given id.
   *
   * @param {any} postId
   *
   * @memberof WP
   */
  async deletePost(postId) {
    const command = `wp post delete ${postId} --force --defer-term-counting`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Gets a specific post by a given post id.
   *
   * @param {in} ID
   * @param {array|string} fields
   * @param {string} [format='json']
   * @returns
   *
   * @memberof WP
   */
  async getPostById(ID, fields, format = 'json') {
    const formattedFields = Array.isArray(fields) ? fields.join() : fields;

    const command = `wp post get ${ID} --fields=${formattedFields} --format=${format}`;

    const post = await this.executeCommand(command);

    return post;
  }

  /**
   * Gets a list of posts. It's possible to filter results
   * by a specific post type or limit fields.
   *
   * @param {array|string} fields
   * @param {string} postType
   * @param {string} [format='json']
   * @returns
   *
   * @memberof WP
   */
  async getPostsList(fields, postType, format = 'json') {
    const formattedFields = Array.isArray(fields) ? fields.join() : fields;

    const command = `wp post list --fields=${formattedFields} --post_type=${postType} --format=${format}`;

    const posts = await this.executeCommand(command);

    return posts;
  }

  /**
   * Assigns meta fields to a given post id.
   *
   * @param {int} postId
   * @param {string} metaKey
   * @param {string} metaValue
   * @param {string} [format='json']
   * @returns
   *
   * @memberof WP
   */
  async addMetaFieldToPost(postId, metaKey, metaValue, format = 'plaintext') {
    const command = `wp post meta add ${postId} '${metaKey}' '${metaValue}' --format=${format}`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Deletes a given post meta field by a given post id.
   *
   * @param {any} postId
   * @param {any} metaKey
   * @param {any} metaValue
   *
   * @memberof WP
   */
  async deletePostMetaField(postId, metaKey, metaValue = '') {
    const command = `wp post meta delete ${postId} '${metaKey}' '${metaValue}'`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Deletes all post meta fields by a given post id.
   *
   * @param {any} postId
   *
   * @memberof WP
   */
  async deleteAllPostMetaFields(postId) {
    const command = `wp post meta delete ${postId} --all`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Gets a specific post meta field by a given post id and meta key.
   *
   * @param {any} postId
   * @param {any} metaKey
   * @param {string} [format='json']
   * @returns
   *
   * @memberof WP
   */
  async getPostMetaField(postId, metaKey, format = 'json') {
    const command = `wp post meta get ${postId} '${metaKey}' --format=${format}`;

    const meta = await this.executeCommand(command);

    return meta;
  }

  /**
   * Gets all post meta fields by a given post id. It's also
   * possible to filter by a specific key.
   *
   * @param {any} postId
   * @param {any} [keys=[]]
   * @param {string} [fields=['meta_key', 'meta_value']]
   * @param {string} [format='json']
   * @returns
   *
   * @memberof WP
   */
  async getAllPostMetaFields(postId, keys, fields = ['meta_key', 'meta_value'], format = 'json') {
    const formattedFields = Array.isArray(fields) ? fields.join() : fields;
    const formattedKeys = Array.isArray(keys) ? keys.join() : keys;

    const command = `wp post meta list ${postId} --keys=${formattedKeys} --fields=${formattedFields} --format=${format}`;

    const metas = await this.executeCommand(command);

    return metas;
  }

  /**
   * Creates a term for a specific taxonomy.
   *
   * @param {any} taxonomy
   * @param {any} term
   * @param {any} parentId
   * @param {string} [description='']
   * @returns
   *
   * @memberof WP
   */
  async createTerm(taxonomy, term, parentId, description = '') {
    let command = `wp term create ${taxonomy} '${term}' --porcelain`;

    command = parentId ? `${command} --parent=${parentId}` : command;
    command = description ? `${command} --description='${description}'` : command;

    const termId = await this.executeCommand(command);

    Logger.info(`Created term ${term} with id ${termId}`);

    return termId;
  }

  /**
   * Deletes a term by a given number of term ids.
   *
   * @param {any} taxonomy
   * @param {any} termIds
   *
   * @memberof WP
   */
  async deleteTerm(taxonomy, termIds) {
    const formattedTermIds = Array.isArray(termIds) ? termIds.join(' ') : termIds;

    const command = `wp term delete ${taxonomy} ${formattedTermIds}`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Recounts and updates the number of posts which use
   * a specific taxonomy.
   *
   * @param {any} taxonomies
   *
   * @memberof WP
   */
  async recountTerm(taxonomies) {
    const formattedTaxonomies = Array.isArray(taxonomies) ? taxonomies.join(' ') : taxonomies;

    const command = `wp term recount ${formattedTaxonomies}`;

    const response = await this.executeCommand(command);

    Logger.info(response);
  }

  /**
   * Generates random posts. You can specify their fields and total of
   * posts to generate.
   *
   * @param {int} count
   * @param {array|string} fields
   * @returns
   *
   * @memberof WP
   */
  async generateRandomPosts(count, fields, format = 'ids') {
    const formattedFields = Object.keys(fields).reduce((previous, key) => `${previous} --${key}='${fields[key]}' `, '');

    const command = `wp post generate --count=${count} ${formattedFields} --format=${format}`;

    const response = await this.executeCommand(command);

    return response;
  }

  /**
   * Executes commands using child_process.exec with promisiy.
   *
   * @param {string} command
   * @param {boolean} [useSkipParams=true]
   * @returns {any} Returns an error or the response.
   *
   * @memberof WP
   */
  async executeCommand(command, useSkipParams = true) {
    const formattedCommand = useSkipParams ? `${command} ${this.skipArgs} ${this.path}` : `${command} ${this.path}`;

    const { stdout, stderr } = await exec(formattedCommand);

    if (stderr) Logger.error(stderr);

    return stdout;
  }
}

module.exports = new WP();
