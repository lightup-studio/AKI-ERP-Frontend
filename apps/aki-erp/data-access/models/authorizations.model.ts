import { Status } from './general.model';
import { Role } from './roles.model';
import { User } from './users.model';

export interface AuthorizeWithPasswordResponse {
  isSuccess: boolean;
  accessToken: string;
  message: string;
  user: User | null;
  roles: Role | null;
}

/**
 *
 * @export
 * @interface IAuthorization
 */
export interface IAuthorization {
  /**
   *
   * @type {number}
   * @memberof IAuthorization
   */
  userId?: number;
  /**
   *
   * @type {AuthorizationType}
   * @memberof IAuthorization
   */
  type?: AuthorizationType;
  /**
   *
   * @type {Status}
   * @memberof IAuthorization
   */
  status?: Status;
}

export enum AuthorizationType {
  Unknown = 'Unknown',
  PasswordHashV1 = 'PasswordHashV1',
}
