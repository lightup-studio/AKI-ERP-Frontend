import { StoreType, storeTypeOptionMap } from '@constants/artwork.constant';

export const showStoreTypeText = (storeType?: StoreType) => {
  if (!storeType) return '';
  if (
    [
      StoreType.LEND,
      StoreType.REPAIR,
      StoreType.SHIPPING,
      StoreType.RETURNED_LEND_OR_RETURNED_REPAIR,
      StoreType.RETURNED_SHIPPING,
      StoreType.NONE,
    ].includes(storeType)
  ) {
    return storeTypeOptionMap[StoreType.IN_STOCK].label;
  }

  return storeTypeOptionMap[storeType].label;
};
