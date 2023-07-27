import { Artwork } from './artwork.model';

/**
 *
 * @export
 * @enum {string}
 */
export enum Status {
  Disabled = 'Disabled',
  Draft = 'Draft',
  Enabled = 'Enabled',
}

/**
 *
 * @export
 * @interface PurchaseOrderIPagging
 */
export interface PurchaseOrderIPagging {
  /**
   *
   * @type {Array<PurchaseOrder>}
   * @memberof PurchaseOrderIPagging
   */
  data?: Array<PurchaseOrder> | null;
  /**
   *
   * @type {number}
   * @memberof PurchaseOrderIPagging
   */
  offset?: number;
  /**
   *
   * @type {number}
   * @memberof PurchaseOrderIPagging
   */
  take?: number;
  /**
   *
   * @type {number}
   * @memberof PurchaseOrderIPagging
   */
  totalCount?: number;
  /**
   *
   * @type {boolean}
   * @memberof PurchaseOrderIPagging
   */
  hasNextPage?: boolean;
}

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
  id?: number;
  /**
   *
   * @type {string}
   * @memberof PurchaseOrder
   */
  displayId?: string | null;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  purchaseTime?: Date;
  /**
   *
   * @type {string}
   * @memberof PurchaseOrder
   */
  salesCompany?: string | null;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseOrder
   */
  salesInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof PurchaseOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof PurchaseOrder
   */
  artworks?: Array<Artwork> | null;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof PurchaseOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof PurchaseOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof PurchaseOrder
   */
  metadata?: { [key: string]: any } | null;
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
  name?: string | null;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  phone?: string | null;
  /**
   *
   * @type {string}
   * @memberof ContactInformation
   */
  address?: string | null;
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
  displayId?: string | null;
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
  salesCompany?: string | null;
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
  artworkIdList?: Array<number> | null;
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
  metadata?: { [key: string]: any } | null;
}
