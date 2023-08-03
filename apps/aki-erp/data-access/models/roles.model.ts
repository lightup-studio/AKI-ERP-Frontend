import { Permission } from './general.model';

/**
 *
 * @export
 * @interface Role
 */
export interface Role {
  /**
   *
   * @type {number}
   * @memberof Role
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof Role
   */
  name?: string;
  /**
   *
   * @type {Array<Permission>}
   * @memberof Role
   */
  permissions?: Array<Permission>;
  /**
   *
   * @type {number}
   * @memberof Role
   */
  sort?: number;
}
