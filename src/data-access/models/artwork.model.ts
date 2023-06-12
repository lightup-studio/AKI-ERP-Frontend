/**
 * 藝術品物件
 */
export interface Artwork {
  /** 單號 */
  id: string;
  /** 藝術家 */
  artist: string;
  /** 圖片 URL */
  image: string;
  /** 媒材 */
  medium: string;
  /** 作品尺寸 */
  size: string;
  /** 年代 */
  year: string;
  /** 其他資訊 */
  otherInfo: string;
  /** 庫存狀態 */
  inventoryStatus: string;
  /** 銷售狀態 */
  salesTypes: string;
  /** 資產類別 */
  assetCategory: string;
}

export interface ArtworkDetail {
  image: string;
  artistNames: ArtistName[];
  assetCategory: string | null;
  type: string | null;
  agentGalleries: AgentGallery[];
  nationality: string | null;
  purchasingUnit: string;
  name: string;
  length: string;
  width: string;
  height: string;
  customSize: string;
  serialNumber: string;
  media: string;
  startYear?: number | null;
  endYear?: number | null;
  edition: string;
  otherInfo: OtherInfo;
  warehouseId: string | null;
  warehouseLocation?: string;
  stockType?:
    | 'lend'
    | 'returnedLend'
    | 'repair'
    | 'returnedRepair'
    | 'shipping'
    | 'returnedShipping';
  lendDepartment?: string;
  returnedLendDepartment?: string;
  repairDepartment?: string;
  repairNote?: string;
  returnRepairDepartment?: string;
  shippingDepartment?: string;
  returnedShippingDepartment?: string;
  salesOrder?: SalesOrder;
}

interface ArtistName {
  chineseName: string;
  englishName: string;
}

interface AgentGallery {
  name: string;
}

interface OtherInfo {
  frame: boolean;
  frameDimensions: string;
  pedestal: boolean;
  pedestalDimensions: string;
  cardboardBox: boolean;
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