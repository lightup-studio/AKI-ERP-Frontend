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
 * @interface ReturnSalesOrder
 */
export interface ReturnSalesOrder {
  /**
   *
   * @type {number}
   * @memberof ReturnSalesOrder
   */
  id: number;
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
