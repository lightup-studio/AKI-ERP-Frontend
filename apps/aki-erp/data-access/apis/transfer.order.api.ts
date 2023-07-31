import {
  CreateOrUpdateTransferOrderRequest,
  Status,
  TransferOrder,
  TransferOrderIPagging,
} from '@data-access/models';
import axios from 'axios';

export const fetchTransferOrder = async (
  status: Status,
  queryString?: string
): Promise<TransferOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/transfer';
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

  const res = await axios.get<TransferOrderIPagging>(`${url}?${query.toString()}`);
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
