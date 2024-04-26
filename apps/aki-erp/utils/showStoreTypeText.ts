import { StoreType, storeTypeOptionMap } from '@constants/artwork.constant';

export const showStoreTypeText = (storeType?: StoreType) => {
  if (storeType === StoreType.RETURNED_LEND_OR_RETURNED_REPAIR) {
    return storeTypeOptionMap[StoreType.IN_STOCK].label;
  }

  return storeTypeOptionMap[storeType || StoreType.IN_STOCK].label;
};
