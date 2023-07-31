import {
  CreateOrUpdateLendOrderRequest,
  LendOrder,
  LendOrderIPagging,
  Status,
} from '@data-access/models';
import axios from 'axios';

export const fetchLendOrder = async (
  status: Status,
  queryString?: string
): Promise<LendOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/lend';
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

  const res = await axios.get<LendOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createLendOrder = async (
  body?: CreateOrUpdateLendOrderRequest
): Promise<LendOrder> => {
  const url = '/api/Order/lend';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateLendOrder = async (
  body?: CreateOrUpdateLendOrderRequest
): Promise<LendOrder> => {
  const url = '/api/Order/lend';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteLendOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/lend';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchLendOrderId = async (id: number): Promise<LendOrder> => {
  const url = '/api/Order/lend';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchLendOrderDIDdisplayId = async (displayId: string): Promise<LendOrder> => {
  const url = '/api/Order/lend';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteLendOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/lend';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
