import { ArtworkDetail } from './artwork.model';
import { Status } from './general.model';
import { ContactInformation } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateSalesReturnOrderRequest
 */
export interface CreateOrUpdateSalesReturnOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  shippingReturnTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  returnerInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateSalesReturnOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface SalesReturnOrder
 */
export interface SalesReturnOrder {
  /**
   *
   * @type {number}
   * @memberof SalesReturnOrder
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof SalesReturnOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof SalesReturnOrder
   */
  shippingReturnTime?: Date;
  /**
   *
   * @type {string}
   * @memberof SalesReturnOrder
   */
  shippingDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof SalesReturnOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof SalesReturnOrder
   */
  returnerInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof SalesReturnOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof SalesReturnOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof SalesReturnOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof SalesReturnOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof SalesReturnOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof SalesReturnOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof SalesReturnOrder
   */
  metadata?: { [key: string]: any };
}
