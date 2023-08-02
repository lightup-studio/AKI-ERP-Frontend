import {
  CreateOrUpdateSalesReturnOrderRequest,
  Pagination,
  ReturnSalesOrder,
  Status,
} from '@data-access/models';
import axios from 'axios';

export const fetchReturnSalesOrder = async (
  status: Status,
  queryString?: string
): Promise<Pagination<ReturnSalesOrder>> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/salesReturn';
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

  const res = await axios.get<Pagination<ReturnSalesOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`
  );

  return res.data;
};

export const createReturnSalesOrder = async (
  body?: CreateOrUpdateSalesReturnOrderRequest
): Promise<ReturnSalesOrder> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateReturnSalesOrder = async (
  body?: CreateOrUpdateSalesReturnOrderRequest
): Promise<ReturnSalesOrder> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteReturnSalesOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchReturnSalesOrderId = async (id: number): Promise<ReturnSalesOrder> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchReturnSalesOrderDIDdisplayId = async (
  displayId: string
): Promise<ReturnSalesOrder> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteReturnSalesOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/salesReturn';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
