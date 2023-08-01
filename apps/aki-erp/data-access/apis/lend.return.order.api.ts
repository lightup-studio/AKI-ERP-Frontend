import {
  CreateOrUpdateLendReturnOrderRequest,
  LendReturnOrder,
  Pagination,
  Status,
} from '@data-access/models';
import axios from 'axios';

export const fetchLendReturnOrder = async (
  status: Status,
  queryString?: string
): Promise<Pagination<LendReturnOrder>> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/lendReturn';
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

  const res = await axios.get<Pagination<LendReturnOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`
  );

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

export const fetchLendReturnOrderDIDdisplayId = async (
  displayId: string
): Promise<LendReturnOrder> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteLendReturnOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/lendReturn';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
