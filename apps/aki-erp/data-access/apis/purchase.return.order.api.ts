import {
  CreateOrUpdatePurchaseReturnOrderRequest,
  PurchaseReturnOrder,
  PurchaseReturnOrderIPagging, Status
} from '@data-access/models';
import axios from 'axios';

export const fetchPurchaseReturnOrder = async (
  status: Status,
  queryString?: string
): Promise<PurchaseReturnOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/purchaseReturn';
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

  const res = await axios.get<PurchaseReturnOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createPurchaseReturnOrder = async (
  body?: CreateOrUpdatePurchaseReturnOrderRequest
): Promise<PurchaseReturnOrder> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.post(url, body);
  return res.data;
};

export const updatePurchaseReturnOrder = async (
  body?: CreateOrUpdatePurchaseReturnOrderRequest
): Promise<PurchaseReturnOrder> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deletePurchaseReturnOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchPurchaseReturnOrderId = async (id: number): Promise<PurchaseReturnOrder> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchPurchaseReturnOrderDIDdisplayId = async (displayId: string): Promise<PurchaseReturnOrder> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deletePurchaseReturnOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/purchaseReturn';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
