import { ArtworkDetail, ArtworkMetadata } from './artwork.model';
import { Status } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateTransferOrderRequest
 */
export interface CreateOrUpdateTransferOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  displayId?: string | null;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  transferTime?: Date;
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  transferTargetWarehouseId?: number | null;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  memo?: string | null;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  transporter?: string | null;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  artworkIdList?: Array<number> | null;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateTransferOrderRequest
   */
  metadata?: { [key: string]: any } | null;
}

/**
 *
 * @export
 * @interface TransferOrder
 */
export interface TransferOrder {
  /**
   *
   * @type {number}
   * @memberof TransferOrder
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof TransferOrder
   */
  displayId?: string | null;
  /**
   *
   * @type {Date}
   * @memberof TransferOrder
   */
  transferTime?: Date;
  /**
   *
   * @type {number}
   * @memberof TransferOrder
   */
  transferTargetWarehouseId?: number | null;
  /**
   *
   * @type {string}
   * @memberof TransferOrder
   */
  memo?: string | null;
  /**
   *
   * @type {string}
   * @memberof TransferOrder
   */
  transporter?: string | null;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof TransferOrder
   */
  artworks?: Array<ArtworkDetail<ArtworkMetadata>> | null;
  /**
   *
   * @type {Date}
   * @memberof TransferOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof TransferOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof TransferOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof TransferOrder
   */
  metadata?: { [key: string]: any } | null;
}

/**
 *
 * @export
 * @interface TransferOrderIPagging
 */
export interface TransferOrderIPagging {
  /**
   *
   * @type {Array<TransferOrder>}
   * @memberof TransferOrderIPagging
   */
  data?: Array<TransferOrder> | null;
  /**
   *
   * @type {number}
   * @memberof TransferOrderIPagging
   */
  offset?: number;
  /**
   *
   * @type {number}
   * @memberof TransferOrderIPagging
   */
  take?: number;
  /**
   *
   * @type {number}
   * @memberof TransferOrderIPagging
   */
  totalCount?: number;
  /**
   *
   * @type {boolean}
   * @memberof TransferOrderIPagging
   */
  hasNextPage?: boolean;
}
