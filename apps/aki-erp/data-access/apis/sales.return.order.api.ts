import axios from '@contexts/axios';
import {
  CreateOrUpdateSalesReturnOrderRequest,
  Pagination,
  SalesReturnOrder,
  Status,
} from '@data-access/models';

const url = '/api/Order/salesReturn';

export const fetchSalesReturnOrder = async (
  status: Status,
  queryString?: string,
): Promise<Pagination<SalesReturnOrder>> => {
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
      const pageSize = +(params.get('pageSize') || 50);
      return query.append('offset', `${pageIndex * pageSize}`);
    }
    if (key === 'pageSize') return query.append('take', value);
    query.append(key, value);
  });

  const res = await axios.get<Pagination<SalesReturnOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`,
  );

  return res.data;
};

export const createSalesReturnOrder = async (
  body?: CreateOrUpdateSalesReturnOrderRequest,
): Promise<SalesReturnOrder> => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updateSalesReturnOrder = async (
  body?: CreateOrUpdateSalesReturnOrderRequest,
): Promise<SalesReturnOrder> => {
  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteSalesReturnOrderId = async (id: number): Promise<void> => {
  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchSalesReturnOrderId = async (id: number): Promise<SalesReturnOrder> => {
  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const exportSalesReturnOrderById = async (id: number) => {
  const res = await axios.get<{ downloadPageUrl: string }>(`${url}/${id}/export`);
  return res.data;
};

export const exportSalesReturnOrdersByIds = async (idList: number[]) => {
  const res = await axios.post<{ downloadPageUrl: string }>(`${url}/exports`, { idList });
  return res.data;
};

export const fetchSalesReturnOrderDIDdisplayId = async (
  displayId: string,
): Promise<SalesReturnOrder> => {
  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteSalesReturnOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
