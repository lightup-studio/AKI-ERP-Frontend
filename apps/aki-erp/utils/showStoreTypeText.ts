import { StoreType, storeTypeOptionMap } from '@constants/artwork.constant';

export const showStoreTypeText = (storeType?: StoreType) => {
  if (storeType === StoreType.IN_STOCK) return storeTypeOptionMap[StoreType.IN_STOCK].label;
  return storeTypeOptionMap[StoreType.NONE].label;
};
