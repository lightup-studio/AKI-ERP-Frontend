export const assetsTypeOptions = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
];

export const storeTypeOptions = [
  {
    label: '無',
    value: 'none',
  },
  {
    label: '在庫',
    value: 'inStock',
  },
  {
    label: '借展',
    value: 'lend',
  },
  {
    label: '維修',
    value: 'repair',
  },
  {
    label: '已歸還',
    value: 'returnedLend_or_returnedRepair',
  },
  {
    label: '已出貨',
    value: 'shipping',
  },
  {
    label: '已退回',
    value: 'returnedShipping',
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

type assetsTypeOption = typeof assetsTypeOptions[number];
type StoreTypeOption = typeof storeTypeOptions[number];
type SalesTypeOption = typeof salesTypeOptions[number];

export const assetsTypeOptionMap = assetsTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur;
  return acc;
}, {} as Record<assetsTypeOption['value'], assetsTypeOption>);

export const storeTypeOptionMap = storeTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur;
  return acc;
}, {} as Record<StoreTypeOption['value'], StoreTypeOption>);

export const salesTypeOptionMap = salesTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur;
  return acc;
}, {} as Record<SalesTypeOption['value'], SalesTypeOption>);
