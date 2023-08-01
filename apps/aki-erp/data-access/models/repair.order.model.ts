import { ArtworkDetail } from './artwork.model';
import { ContactInformation, Status } from './purchase.order.model';

/**
 *
 * @export
 * @interface CreateOrUpdateRepairOrderRequest
 */
export interface CreateOrUpdateRepairOrderRequest {
  /**
   *
   * @type {number}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  repairTime?: Date;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  repairDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  memo?: string;
  /**
   *
   * @type {Array<number>}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  artworkIdList?: Array<number>;
  /**
   *
   * @type {Status}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof CreateOrUpdateRepairOrderRequest
   */
  metadata?: { [key: string]: any };
}

/**
 *
 * @export
 * @interface RepairOrder
 */
export interface RepairOrder {
  /**
   *
   * @type {number}
   * @memberof RepairOrder
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof RepairOrder
   */
  displayId?: string;
  /**
   *
   * @type {Date}
   * @memberof RepairOrder
   */
  repairTime?: Date;
  /**
   *
   * @type {string}
   * @memberof RepairOrder
   */
  repairDepartment?: string;
  /**
   *
   * @type {ContactInformation}
   * @memberof RepairOrder
   */
  contactPersonInformation?: ContactInformation;
  /**
   *
   * @type {ContactInformation}
   * @memberof RepairOrder
   */
  receiverInformation?: ContactInformation;
  /**
   *
   * @type {string}
   * @memberof RepairOrder
   */
  address?: string;
  /**
   *
   * @type {string}
   * @memberof RepairOrder
   */
  memo?: string;
  /**
   *
   * @type {Array<Artwork>}
   * @memberof RepairOrder
   */
  artworks?: Array<ArtworkDetail>;
  /**
   *
   * @type {Date}
   * @memberof RepairOrder
   */
  createTime?: Date;
  /**
   *
   * @type {Date}
   * @memberof RepairOrder
   */
  lastModifyTime?: Date;
  /**
   *
   * @type {Status}
   * @memberof RepairOrder
   */
  status?: Status;
  /**
   *
   * @type {{ [key: string]: any; }}
   * @memberof RepairOrder
   */
  metadata?: { [key: string]: any };
}
