import { ArtworkDetail } from './artwork.model';
import { ContactInformation, Status } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateSalesOrderRequest
 */
export interface CreateOrUpdateSalesOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  shippingTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface SalesOrder
 */
export interface SalesOrder {
  /**
   *
   * @type {number}
   * @memberof SalesOrder
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof SalesOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof SalesOrder
   */
  shippingTime?: Date;
  /**
   *
   * @type {string}
   * @memberof SalesOrder
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof SalesOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof SalesOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof SalesOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof SalesOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof SalesOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof SalesOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof SalesOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof SalesOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof SalesOrder
   */
  metadata?: { [key: string]: any };
}
