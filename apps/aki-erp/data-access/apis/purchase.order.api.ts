import axios from '@contexts/axios';
import {
  CreateOrUpdatePurchaseOrderRequest,
  Pagination,
  PurchaseOrder,
  Status,
} from '@data-access/models';

const url = '/api/Order/purchase';

export const fetchPurchaseOrder = async (
  status: Status,
  queryString?: string
): Promise<Pagination<PurchaseOrder>> => {
  const params = new URLSearchParams(queryString);
  const query = new URLSearchParams();

  [...params.entries()].forEach(([key, value]) => {
    if (key === 'nationalities') return query.append('countryCode', value);
    if (key === 'artists') return query.append('artistName', value);
    if (key === 'storeTypes') return query.append('metadatas', `{"storeType":"${value}"}`);
    if (key === 'salesTypes') return query.append('metadatas', `{"salesType":"${value}"}`);
    if (key === 'assetsTypes') return query.append('metadatas', `{"assetsType":"${value}"}`);
    if (key === 'serialNumbers') return query.append('metadatas', `{"serialNumber":"${value}"}`);
    if (key === 'pageIndex') return query.append('offset', value);
    if (key === 'pageSize') return query.append('take', value);
    query.append(key, value);
  });

  const res = await axios.get<Pagination<PurchaseOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`
  );

  return res.data;
};

export const createPurchaseOrder = async (
  body?: CreateOrUpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updatePurchaseOrder = async (
  body?: CreateOrUpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deletePurchaseOrderId = async (id: number): Promise<void> => {
  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchPurchaseOrderId = async (id: number): Promise<PurchaseOrder> => {
  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const exportPurchaseOrderById = async (id: number) => {
  const res = await axios.get<{ downloadPageUrl: string }>(`${url}/${id}/export`);
  return res.data;
};

export const fetchPurchaseOrderDIDdisplayId = async (displayId: string): Promise<PurchaseOrder> => {
  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deletePurchaseOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
