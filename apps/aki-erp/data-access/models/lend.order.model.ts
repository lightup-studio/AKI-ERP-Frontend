import { ArtworkDetail, ArtworkMetadata } from './artwork.model';
import { Status } from './general.model';
import { ContactInformation } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateLendOrderRequest
 */
export interface CreateOrUpdateLendOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  lendTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  lendDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateLendOrderRequest
   */
  metadata?: Partial<ArtworkMetadata>;
}

/**
 *
 * @export
 * @interface LendOrder
 */
export interface LendOrder {
  /**
   *
   * @type {number}
   * @memberof LendOrder
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof LendOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof LendOrder
   */
  lendTime?: Date;
  /**
   *
   * @type {string}
   * @memberof LendOrder
   */
  lendDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof LendOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof LendOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof LendOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof LendOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof LendOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof LendOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof LendOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof LendOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof LendOrder
   */
  metadata?: { [key: string]: any };
}
