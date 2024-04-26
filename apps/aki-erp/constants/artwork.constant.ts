export enum StoreType {
  NONE = 'none',
  IN_STOCK = 'inStock',
  LEND = 'lend',
  REPAIR = 'repair',
  RETURNED_LEND_OR_RETURNED_REPAIR = 'returnedLend_or_returnedRepair',
  SHIPPING = 'shipping',
  RETURNED_SHIPPING = 'returnedShipping',
}

export const assetsTypeOptions = [
  { label: '無', value: '無' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
] as const;

export const warehouseMap = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
} as Record<number, string>;

export const storeTypeOptions = [
  {
    label: '無',
    value: StoreType.NONE,
  },
  {
    label: '在庫',
    value: StoreType.IN_STOCK,
  },
  {
    label: '借展',
    value: StoreType.LEND,
  },
  {
    label: '維修',
    value: StoreType.REPAIR,
  },
  {
    label: '已歸還',
    value: StoreType.RETURNED_LEND_OR_RETURNED_REPAIR,
  },
  {
    label: '已出貨',
    value: StoreType.SHIPPING,
  },
  {
    label: '已退回',
    value: StoreType.RETURNED_SHIPPING,
  },
] as const;

export const salesTypeOptions = [
  {
    label: '已售',
    value: 'sold',
  },
  {
    label: '未售',
    value: 'unsold',
  },
] as const;

type assetsTypeOption = (typeof assetsTypeOptions)[number];
type StoreTypeOption = (typeof storeTypeOptions)[number];
type SalesTypeOption = (typeof salesTypeOptions)[number];

export const assetsTypeOptionMap = assetsTypeOptions.reduce(
  (acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  },
  {} as Record<assetsTypeOption['value'], assetsTypeOption>,
);

export const storeTypeOptionMap = storeTypeOptions.reduce(
  (acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  },
  {} as Record<StoreTypeOption['value'], StoreTypeOption>,
);

export const salesTypeOptionMap = salesTypeOptions.reduce(
  (acc, cur) => {
    acc[cur.value] = cur;
    return acc;
  },
  {} as Record<SalesTypeOption['value'], SalesTypeOption>,
);
