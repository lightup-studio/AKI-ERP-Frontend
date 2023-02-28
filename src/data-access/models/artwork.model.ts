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
