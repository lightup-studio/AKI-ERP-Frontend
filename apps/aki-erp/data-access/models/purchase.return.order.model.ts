import { ArtworkDetail } from './artwork.model';
import { Status } from './general.model';
import { ContactInformation } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdatePurchaseReturnOrderRequest
 */
export interface CreateOrUpdatePurchaseReturnOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  purchaseReturnTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  returnCompany?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  returnerInformation?: ContactInformation;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdatePurchaseReturnOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface PurchaseReturnOrder
 */
export interface PurchaseReturnOrder {
  /**
   *
   * @type {number}
   * @memberof PurchaseReturnOrder
   */
  id: number;
  /**
   *
   * @type {string}
   * @memberof PurchaseReturnOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof PurchaseReturnOrder
   */
  purchaseReturnTime?: Date;
  /**
   *
   * @type {string}
   * @memberof PurchaseReturnOrder
   */
  returnCompany?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseReturnOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseReturnOrder
   */
  returnerInformation?: ContactInformation;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof PurchaseReturnOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof PurchaseReturnOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof PurchaseReturnOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof PurchaseReturnOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof PurchaseReturnOrder
   */
  metadata?: { [key: string]: any };
}
