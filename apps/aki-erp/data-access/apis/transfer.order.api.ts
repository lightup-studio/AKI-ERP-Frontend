import { DEFAULT_PAGE_SIZE } from '@constants/page.constant';
import axios from '@contexts/axios';
import {
  CreateOrUpdateTransferOrderRequest,
  Pagination,
  Status,
  TransferOrder,
} from '@data-access/models';

const url = '/api/Order/transfer';

export const fetchTransferOrder = async (
  status: Status,
  queryString?: string,
): Promise<Pagination<TransferOrder>> => {
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

  const res = await axios.get<Pagination<TransferOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`,
  );

  return res.data;
};

export const createTransferOrder = async (
  body?: CreateOrUpdateTransferOrderRequest,
): Promise<TransferOrder> => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updateTransferOrder = async (
  body?: CreateOrUpdateTransferOrderRequest,
): Promise<TransferOrder> => {
  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteTransferOrderId = async (id: number): Promise<void> => {
  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchTransferOrderId = async (id: number): Promise<TransferOrder> => {
  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const exportTransferOrderById = async (id: number) => {
  const res = await axios.get<{ downloadPageUrl: string }>(`${url}/${id}/export`);
  return res.data;
};

export const exportTransferOrdersByIds = async (idList: number[]) => {
  const res = await axios.post<{ downloadPageUrl: string }>(`${url}/exports`, { idList });
  return res.data;
};

export const fetchTransferOrderDIDdisplayId = async (displayId: string): Promise<TransferOrder> => {
  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteTransferOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
