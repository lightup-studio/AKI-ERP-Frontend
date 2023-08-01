import { ArtworkDetail } from './artwork.model';
import { Status } from './general.model';
import { ContactInformation } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateLendReturnOrderRequest
 */
export interface CreateOrUpdateLendReturnOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  lendTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  lendDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateLendReturnOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface LendReturnOrder
 */
export interface LendReturnOrder {
  /**
   *
   * @type {number}
   * @memberof LendReturnOrder
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof LendReturnOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof LendReturnOrder
   */
  lendTime?: Date;
  /**
   *
   * @type {string}
   * @memberof LendReturnOrder
   */
  lendDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof LendReturnOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof LendReturnOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof LendReturnOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof LendReturnOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof LendReturnOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof LendReturnOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof LendReturnOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof LendReturnOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof LendReturnOrder
   */
  metadata?: { [key: string]: any };
}
