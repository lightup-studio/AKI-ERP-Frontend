import {
  CreateOrUpdateTransferOrderRequest,
  Pagination,
  Status,
  TransferOrder,
} from '@data-access/models';
import axios from 'axios';

export const fetchTransferOrder = async (
  status: Status,
  queryString?: string
): Promise<Pagination<TransferOrder>> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/transfer';
  const query = new URLSearchParams();

  query.append('status', status);
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

  const res = await axios.get<Pagination<TransferOrder>>(`${url}?${query.toString()}`);
  return res.data;
};

export const createTransferOrder = async (
  body?: CreateOrUpdateTransferOrderRequest
): Promise<TransferOrder> => {
  const url = '/api/Order/transfer';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateTransferOrder = async (
  body?: CreateOrUpdateTransferOrderRequest
): Promise<TransferOrder> => {
  const url = '/api/Order/transfer';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteTransferOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/transfer';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchTransferOrderId = async (id: number): Promise<TransferOrder> => {
  const url = '/api/Order/transfer';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchTransferOrderDIDdisplayId = async (displayId: string): Promise<TransferOrder> => {
  const url = '/api/Order/transfer';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteTransferOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/transfer';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
