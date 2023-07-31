import {
  CreateOrUpdateLendReturnOrderRequest,
  LendReturnOrder,
  LendReturnOrderIPagging,
  Status,
} from '@data-access/models';
import axios from 'axios';

export const fetchLendReturnOrder = async (
  status: Status,
  queryString?: string
): Promise<LendReturnOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/lendReturn';
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

  const res = await axios.get<LendReturnOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createLendReturnOrder = async (
  body?: CreateOrUpdateLendReturnOrderRequest
): Promise<LendReturnOrder> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateLendReturnOrder = async (
  body?: CreateOrUpdateLendReturnOrderRequest
): Promise<LendReturnOrder> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteLendReturnOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchLendReturnOrderId = async (id: number): Promise<LendReturnOrder> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchLendReturnOrderDIDdisplayId = async (displayId: string): Promise<LendReturnOrder> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteLendReturnOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
