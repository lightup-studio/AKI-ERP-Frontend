import { ArtworkDetail, ArtworkMetadata } from './artwork.model';
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
  displayId?: string | null;
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
  shippingDepartment?: string | null;
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
  address?: string | null;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  memo?: string | null;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateSalesOrderRequest
   */
  artworkIdList?: Array<number> | null;
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
  metadata?: { [key: string]: any } | null;
}

/**
 *
 * @export
 * @interface SalesOrderIPagging
 */
export interface SalesOrderIPagging {
  /**
   *
   * @type {Array<SalesOrder>}
   * @memberof SalesOrderIPagging
   */
  data?: Array<SalesOrder> | null;
  /**
   *
   * @type {number}
   * @memberof SalesOrderIPagging
   */
  offset?: number;
  /**
   *
   * @type {number}
   * @memberof SalesOrderIPagging
   */
  take?: number;
  /**
   *
   * @type {number}
   * @memberof SalesOrderIPagging
   */
  totalCount?: number;
  /**
   *
   * @type {boolean}
   * @memberof SalesOrderIPagging
   */
  hasNextPage?: boolean;
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
  displayId?: string | null;
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
  shippingDepartment?: string | null;
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
  address?: string | null;
  /**
   *
   * @type {string}
   * @memberof SalesOrder
   */
  memo?: string | null;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof SalesOrder
   */
  artworks?: Array<ArtworkDetail<ArtworkMetadata>> | null;
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
  metadata?: { [key: string]: any } | null;
}
