import { assetsTypeOptions, salesTypeOptions, storeTypeOptions } from '@constants/artwork.constant';

/**
 * 藝術品物件
 */
export interface Artwork {
  id: number;
  departmentId: number;
  assetsTypeId: number;
  name: string;
  artistId: number;
  yearsInfo: string;
  materialInfo: string;
  sizeInfo: string;
  otherInfo: string;
  rawImageFilename: string;
  displayImageFilename: string;
  status: string;
  createTime: string;
  modifyTime: string;
  storeTypeId: number;
  storeInfo: string;
  metadata?: any;
  salesStatusId: number;
  rawImageUrl: string;
  displayImageUrl: string;
}

export interface ArtworkDetail<TMetadata = ArtworkMetadata> {
  id: number;
  displayId: string;
  warehouseId?: number;
  zhName: string;
  enName: string;
  imageUrl: string;
  thumbnailUrl: string;
  /** 國籍 (取代既有的 nationality) */
  countryCode: string | null;
  createTime: string | Date;
  lastModifyTime: string | Date;
  status: 'Disabled' | 'Draft' | 'Enabled';
  artists: ArtworkArtist[];
  /** 取代 startYear */
  yearRangeStart?: number | null;
  /** 取代 endYear */
  yearRangeEnd?: number | null;
  metadata?: TMetadata;
}

export interface ArtworkArtist {
  zhName: string;
  enName: string;
}

export interface ArtworkMetadata {
  /** 作品類型 */
  artworkType: string | null;
  /** 資產類別 */
  assetsType?: typeof assetsTypeOptions[number]['value'];
  /** 代理藝廊 */
  agentGalleries: AgentGallery[];
  /** 進貨單位 */
  purchasingUnit: string;
  /** 長 */
  length: string;
  /** 寬 */
  width: string;
  /** 高 */
  height: string;
  /** 自定義尺寸 */
  customSize: string;
  /** 號數 */
  serialNumber: string;
  /** 媒材 */
  media: string;
  /** 版次 ed. */
  edition: string;

  otherInfo: OtherInfo;

  /** 自填庫存位置 */
  warehouseLocation?: string;
  /** 庫存狀態 */
  storeType?: typeof storeTypeOptions[number]['value'];
  /** 借展，單位 */
  lendDepartment?: string;
  /** 維修，單位 */
  repairDepartment?: string;
  /** 維修，狀態說明 */
  repairNote?: string;
  /** 已歸還，單位 */
  returnRepairDepartment?: string;
  /** 已退回，單位 */
  returnedShippingDepartment?: string;
  /** 銷售狀態 */
  salesType?: typeof salesTypeOptions[number]['value'];
  salesOrder?: SalesOrder;
}

interface AgentGallery {
  name: string;
}

interface OtherInfo {
  /** 表框 */
  frame: boolean;
  /** 表框，尺寸 */
  frameDimensions: string;
  /** 台座 */
  pedestal: boolean;
  /** 台座，尺寸 */
  pedestalDimensions: string;
  /** 紙箱 */
  cardboardBox: boolean;
  /** 木箱 */
  woodenBox: boolean;
}

interface SalesOrder {
  saleDepartment: string;
  saleDate: string;
  recipientName: string;
  contractPersonName: string;
  recipientPhone: string;
  contractPersonPhone: string;
  address: string;
  remark?: string;
}

export interface AssetsType {
  id: string;
  name: string;
  description: string;
  sort: 0;
  status: string;
}

export interface StoreType {
  id: string;
  name: string;
  sort: 0;
  status: string;
}

export interface SalesType {
  id: string;
  name: string;
  sort: 0;
  status: string;
}

export interface CommonBatchPartialUpdateById {
  idList?: Array<number>;
  properties?: Partial<ArtworkDetail<ArtworkMetadata>>;
}
