import {
  CreateOrUpdatePurchaseOrderRequest,
  PurchaseOrder,
  PurchaseOrderIPagging,
  Status,
} from '@data-access/models/purchase.order.model';
import axios from 'axios';

export const fetchPurchaseOrder = async (
  status: Status,
  queryString?: string
): Promise<PurchaseOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/purchase';
  const query = new URLSearchParams();

  query.append('status', status);
  [...params.entries()].forEach(([key, value]) => {
    if (key === 'nationalities') query.append('countryCode', value);
    if (key === 'artists') query.append('artistName', value);
    if (key === 'storeTypes') query.append('metadatas', `{"storeType":"${value}"}`);
    if (key === 'salesTypes') query.append('metadatas', `{"salesType":"${value}"}`);
    if (key === 'assetsTypes') query.append('metadatas', `{"assetsType":"${value}"}`);
    if (key === 'serialNumbers') query.append('metadatas', `{"serialNumber":"${value}"}`);
    if (key === 'pageIndex') query.append('offset', value);
    if (key === 'pageSize') query.append('take', value);
  });

  const res = await axios.get<PurchaseOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createPurchaseOrder = async (
  body?: CreateOrUpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const url = '/api/Order/purchase';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateOrderPurchase = async (
  body?: CreateOrUpdatePurchaseOrderRequest
): Promise<PurchaseOrder> => {
  const url = '/api/Order/purchase';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteOrderPurchaseId = async (id: number): Promise<void> => {
  const url = '/api/Order/purchase';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const getOrderPurchaseId = async (id: number): Promise<PurchaseOrder> => {
  const url = '/api/Order/purchase';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const getOrderPurchaseDIDdisplayId = async (displayId: string): Promise<PurchaseOrder> => {
  const url = '/api/Order/purchase';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteOrderPurchaseDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/purchase';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
