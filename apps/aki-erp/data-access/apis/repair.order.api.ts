import {
  CreateOrUpdateRepairOrderRequest,
  RepairOrder,
  RepairOrderIPagging,
  Status,
} from '@data-access/models';
import {} from '@data-access/models/purchase.order.model';
import axios from 'axios';

export const fetchRepairOrder = async (
  status: Status,
  queryString?: string
): Promise<RepairOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/repair';
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

  const res = await axios.get<RepairOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createRepairOrder = async (
  body?: CreateOrUpdateRepairOrderRequest
): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateRepairOrder = async (
  body?: CreateOrUpdateRepairOrderRequest
): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteRepairOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/repair';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchRepairOrderId = async (id: number): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchRepairOrderDIDdisplayId = async (displayId: string): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteRepairOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/repair';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
