import { IAuthorization } from './authorizations.model';
import { Status } from './general.model';

/**
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   *
   * @type {number}
   * @memberof User
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof User
   */
  account?: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof User
   */
  avatarUrl?: string;
  /**
   *
   * @type {Date}
   * @memberof User
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof User
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof User
   */
  status?: Status;
  /**
   *
   * @type {Array<IAuthorization>}
   * @memberof User
   */
  authorizations?: Array<IAuthorization>;
}
