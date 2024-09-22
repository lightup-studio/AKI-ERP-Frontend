import { DEFAULT_PAGE_SIZE } from '@constants/page.constant';
import axios from '@contexts/axios';
import {
  CreateOrUpdateLendReturnOrderRequest,
  LendReturnOrder,
  Pagination,
  Status,
} from '@data-access/models';

const url = '/api/Order/lendReturn';

export const fetchLendReturnOrder = async (
  queryString?: string,
  status?: Status,
): Promise<Pagination<LendReturnOrder>> => {
  const params = new URLSearchParams(queryString);
  const query = new URLSearchParams();

  [...params.entries()].forEach(([key, value]) => {
    if (key === 'nationalities') return query.append('countryCode', value);
    if (key === 'artists') return query.append('artistName', value);
    if (key === 'storeTypes') return query.append('metadatas', `{"storeType":"${value}"}`);
    if (key === 'salesTypes') return query.append('metadatas', `{"salesType":"${value}"}`);
    if (key === 'assetsTypes') return query.append('metadatas', `{"assetsType":"${value}"}`);
    if (key === 'serialNumbers') return query.append('metadatas', `{"serialNumber":"${value}"}`);
    if (key === 'pageIndex') {
      const pageIndex = +(params.get('pageIndex') || 0);
      const pageSize = +(params.get('pageSize') || DEFAULT_PAGE_SIZE);
      return query.append('offset', `${pageIndex * pageSize}`);
    }
    if (key === 'pageSize') return query.append('take', value);
    query.append(key, value);
  });

  if (status) query.append('status', status);

  const res = await axios.get<Pagination<LendReturnOrder>>(
    `${url}${query.toString() ? `?${query.toString()}` : ''}`,
  );

  return res.data;
};

export const createLendReturnOrder = async (
  body?: CreateOrUpdateLendReturnOrderRequest,
): Promise<LendReturnOrder> => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updateLendReturnOrder = async (
  body?: CreateOrUpdateLendReturnOrderRequest,
): Promise<LendReturnOrder> => {
  const res = await axios.put(url, body);
  return res.data;
};

export const deleteLendReturnOrderId = async (id: number): Promise<void> => {
  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchLendReturnOrderId = async (id: number): Promise<LendReturnOrder> => {
  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const exportLendReturnOrderById = async (id: number) => {
  const res = await axios.get<{ downloadPageUrl: string }>(`${url}/${id}/export`);
  return res.data;
};

export const exportLendReturnOrdersByIds = async (idList: number[]) => {
  const res = await axios.post<{ downloadPageUrl: string }>(`${url}/exports`, { idList });
  return res.data;
};

export const fetchLendReturnOrderDIDdisplayId = async (
  displayId: string,
): Promise<LendReturnOrder> => {
  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteLendReturnOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
