import {
  CreateOrUpdateSalesOrderRequest,
  SalesOrder,
  SalesOrderIPagging,
  Status,
} from '@data-access/models';
import {} from '@data-access/models/purchase.order.model';
import axios from 'axios';

export const fetchSalesOrder = async (
  status: Status,
  queryString?: string
): Promise<SalesOrderIPagging> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/sales';
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

  const res = await axios.get<SalesOrderIPagging>(`${url}?${query.toString()}`);
  return res.data;
};

export const createSalesOrder = async (
  body?: CreateOrUpdateSalesOrderRequest
): Promise<SalesOrder> => {
  const url = '/api/Order/sales';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateSalesOrder = async (
  body?: CreateOrUpdateSalesOrderRequest
): Promise<SalesOrder> => {
  const url = '/api/Order/sales';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteSalesOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/sales';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchSalesOrderId = async (id: number): Promise<SalesOrder> => {
  const url = '/api/Order/sales';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchSalesOrderDIDdisplayId = async (displayId: string): Promise<SalesOrder> => {
  const url = '/api/Order/sales';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteSalesOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/sales';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
