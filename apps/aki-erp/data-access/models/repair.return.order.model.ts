import { ArtworkDetail } from './artwork.model';
import { Status } from './general.model';
import { ContactInformation } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateRepairReturnOrderRequest
 */
export interface CreateOrUpdateRepairReturnOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  repairTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  repairDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateRepairReturnOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface RepairReturnOrder
 */
export interface RepairReturnOrder {
  /**
   *
   * @type {number}
   * @memberof RepairReturnOrder
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof RepairReturnOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof RepairReturnOrder
   */
  repairTime?: Date;
  /**
   *
   * @type {string}
   * @memberof RepairReturnOrder
   */
  repairDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof RepairReturnOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof RepairReturnOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof RepairReturnOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof RepairReturnOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof RepairReturnOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof RepairReturnOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof RepairReturnOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof RepairReturnOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof RepairReturnOrder
   */
  metadata?: { [key: string]: any };
}
