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
  const paramsObject = Object.fromEntries(params.entries());

  if (!paramsObject['status']) paramsObject['status'] = status;
  if (!paramsObject['pageSize']) paramsObject['take'] = '50';
  if (!paramsObject['pageIndex']) paramsObject['offset'] = '0';

  const url = '/api/Order/purchase';
  const query = new URLSearchParams();
  Object.keys(paramsObject).map((key: string) => query.set(key, paramsObject[key]));

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
