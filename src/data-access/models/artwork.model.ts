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
  salesStatus: string;
  /** 資產類別 */
  assetCategory: string;
}

export interface ArtworkDetail {
  image: string;
  artistNames: ArtistName[];
  assetCategory: string;
  type: string;
  agentGalleries: AgentGallery[];
  nationality: string;
  name: string;
  length: string;
  width: string;
  height: string;
  customSize: string;
  serialNumber: string;
  media: string;
  year: string;
  edition: string;
  otherInfo: OtherInfo;
  stockLocationId: string;
  stockStatus: StockStatus;
}

interface StockStatus {
  id: string;
  unitText: string;
  remark: string;
}

interface OtherInfo {
  frame: boolean;
  frameDimensions: string;
  pedestal: boolean;
  pedestalDimensions: string;
  cardboardBox: boolean;
  woodenBox: boolean;
}

interface AgentGallery {
  name: string;
}

interface ArtistName {
  chineseName: string;
  englishName: string;
}