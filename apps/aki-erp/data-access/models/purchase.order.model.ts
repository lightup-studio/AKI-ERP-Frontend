import { ArtworkDetail } from './artwork.model';
import { Status } from './general.model';

/**
 *
 * @export
 * @interface PurchaseOrder
 */
export interface PurchaseOrder {
  /**
   *
   * @type {number}
   * @memberof PurchaseOrder
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof PurchaseOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  purchaseTime?: string;
  /**
   *
   * @type {string}
   * @memberof PurchaseOrder
   */
  salesCompany?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseOrder
   */
  salesInformation: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseOrder
   */
  receiverInformation: ContactInformation;
  /**
   *
   * @type {Array<ArtworkDetail>}
   * @memberof PurchaseOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  createTime: Date;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  lastModifyTime: Date;
  /**
   *
   * @type {Status}
   * @memberof PurchaseOrder
   */
  status: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof PurchaseOrder
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface ContactInformation
 */
export interface ContactInformation {
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  phone?: string;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  address?: string;
}

/**
 *
 * @export
 * @interface CreateOrUpdatePurchaseOrderRequest
 */
export interface CreateOrUpdatePurchaseOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  purchaseTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  salesCompany?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  salesInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdatePurchaseOrderRequest
   */
  metadata?: { [key: string]: any };
}
