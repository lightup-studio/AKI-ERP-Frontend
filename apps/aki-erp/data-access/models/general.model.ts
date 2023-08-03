export enum Status {
  Disabled = 'Disabled',
  Draft = 'Draft',
  Enabled = 'Enabled',
}

export enum Permission {
  Unknown = 'Unknown',
  AccountManagement = 'AccountManagement',
  RoleManagement = 'RoleManagement',
  PartnerManagement = 'PartnerManagement',
  PartnerManagementArtist = 'PartnerManagement_Artist',
  PartnerManagementCompany = 'PartnerManagement_Company',
  PartnerManagementCustomer = 'PartnerManagement_Customer',
  ArtworkManagement = 'ArtworkManagement',
  ArtworkManagementRead = 'ArtworkManagement_Read',
  ArtworkManagementCreate = 'ArtworkManagement_Create',
  ArtworkManagementUpdate = 'ArtworkManagement_Update',
  ArtworkManagementDelete = 'ArtworkManagement_Delete',
  ArtworkManagementUpdateSalesInfo = 'ArtworkManagement_Update_SalesInfo',
  OrderManagement = 'OrderManagement',
  OrderManagementPurchaseOrder = 'OrderManagement_PurchaseOrder',
  OrderManagementSellOrder = 'OrderManagement_SellOrder',
  OrderManagementTransferOrder = 'OrderManagement_TransferOrder',
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface Pagination<T> {
  data: T[];
  offset: number;
  take: number;
  pageCount: number;
  totalCount: number;
}
