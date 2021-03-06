import Base from './base';

/**
 * https://g0v.hackmd.io/eIeU2g86Tfu5VnLazNfUvQ
 */
class UserSettings extends Base {
  static get DEFAULT_DATA() {
    return {
      createdAt: new Date(),
      allowNewReplyUpdate: true,
    };
  }

  static get collection() {
    return 'userSettings';
  }

  /**
   *
   * @override
   * @param {UserSettings} data
   * @returns {UserSettings}
   */
  static async create(data) {
    return super.create({
      ...this.DEFAULT_DATA,
      ...data,
    });
  }

  /**
   * An atomic and upsert enabled operation.
   * @param {string} userId
   * @returns {Promise<UserSettings>}
   */
  static async findOrInsertByUserId(userId) {
    return this.findOneAndUpdate({ userId }, null, this.DEFAULT_DATA);
  }

  /**
   * @param {string|string[]} userIds
   * @param {import('mongodb').FindOneOptions} options
   * @returns {Promise<UserSettings[]>}
   */
  static async findByUserIds(userIds, options = {}) {
    const { skip = 0, limit = 20, sort = { createdAt: -1 } } = options;
    return this.find({ userId: { $in: userIds } }, { limit, skip, sort });
  }

  /**
   * An atomic and upsert enabled operation.
   * @param {string} userId
   * @param {boolean} allow
   * @returns {Promise<UserSettings>}
   */
  static async setAllowNewReplyUpdate(userId, allow) {
    // eslint-disable-next-line no-unused-vars
    const { allowNewReplyUpdate, ...$setOnInsert } = this.DEFAULT_DATA;

    return this.findOneAndUpdate(
      { userId },
      {
        allowNewReplyUpdate: allow,
      },
      $setOnInsert
    );
  }

  /**
   * An atomic and upsert enabled operation.
   * @param {string} userId
   * @param {string} token
   * @returns {Promise<UserSettings>}
   */
  static async setNewReplyNotifyToken(userId, token) {
    // eslint-disable-next-line no-unused-vars
    const { newReplyNotifyToken, ...$setOnInsert } = this.DEFAULT_DATA;

    return this.findOneAndUpdate(
      { userId },
      {
        newReplyNotifyToken: token,
      },
      $setOnInsert
    );
  }

  /**
   * @type {string}
   */
  userId;

  /**
   * @type {Date}
   */
  createdAt;

  /**
   * @type {boolean}
   */
  allowNewReplyUpdate;

  /**
   * @type {?string}
   */
  newReplyNotifyToken;
}

export default UserSettings;
