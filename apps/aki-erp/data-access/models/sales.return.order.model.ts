import { ArtworkDetail } from './artwork.model';
import { ContactInformation, Status } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateReturnSalesOrderRequest
 */
export interface CreateOrUpdateReturnSalesOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  shippingTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateReturnSalesOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface ReturnSalesOrder
 */
export interface ReturnSalesOrder {
  /**
   *
   * @type {number}
   * @memberof ReturnSalesOrder
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof ReturnSalesOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof ReturnSalesOrder
   */
  shippingTime?: Date;
  /**
   *
   * @type {string}
   * @memberof ReturnSalesOrder
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof ReturnSalesOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof ReturnSalesOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof ReturnSalesOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof ReturnSalesOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof ReturnSalesOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof ReturnSalesOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof ReturnSalesOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof ReturnSalesOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof ReturnSalesOrder
   */
  metadata?: { [key: string]: any };
}
