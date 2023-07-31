import { ArtworkDetail } from './artwork.model';
import { ContactInformation, Status } from './purchase.order.model';

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
  displayId?: string | null;
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
  returnCompany?: string | null;
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
  artworkIdList?: Array<number> | null;
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
  metadata?: { [key: string]: any; } | null;
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
  id?: number;
  /**
   * 
   * @type {string}
   * @memberof PurchaseReturnOrder
   */
  displayId?: string | null;
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
  returnCompany?: string | null;
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
  artworks?: Array<ArtworkDetail> | null;
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
  metadata?: { [key: string]: any; } | null;
}

/**
 * 
 * @export
 * @interface PurchaseReturnOrderIPagging
 */
export interface PurchaseReturnOrderIPagging {
  /**
   * 
   * @type {Array<PurchaseReturnOrder>}
   * @memberof PurchaseReturnOrderIPagging
   */
  data?: Array<PurchaseReturnOrder> | null;
  /**
   * 
   * @type {number}
   * @memberof PurchaseReturnOrderIPagging
   */
  offset?: number;
  /**
   * 
   * @type {number}
   * @memberof PurchaseReturnOrderIPagging
   */
  take?: number;
  /**
   * 
   * @type {number}
   * @memberof PurchaseReturnOrderIPagging
   */
  totalCount?: number;
  /**
   * 
   * @type {boolean}
   * @memberof PurchaseReturnOrderIPagging
   */
  hasNextPage?: boolean;
}