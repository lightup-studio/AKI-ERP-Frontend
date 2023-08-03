import axios from '@contexts/axios';
import {
  CreateOrUpdateRepairOrderRequest,
  Pagination,
  RepairOrder,
  Status,
} from '@data-access/models';

export const fetchRepairOrder = async (
  status: Status,
  queryString?: string
): Promise<Pagination<RepairOrder>> => {
  const params = new URLSearchParams(queryString);

  const url = '/api/Order/repair';
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

  const res = await axios.get<Pagination<RepairOrder>>(
    `${url}?status=${status}${query.toString() ? `&${query.toString()}` : ''}`
  );

  return res.data;
};

export const createRepairOrder = async (
  body?: CreateOrUpdateRepairOrderRequest
): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.post(url, body);
  return res.data;
};

export const updateRepairOrder = async (
  body?: CreateOrUpdateRepairOrderRequest
): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.put(url, body, { params: { allowCreate: true } });
  return res.data;
};

export const deleteRepairOrderId = async (id: number): Promise<void> => {
  const url = '/api/Order/repair';

  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};

export const fetchRepairOrderId = async (id: number): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const fetchRepairOrderDIDdisplayId = async (displayId: string): Promise<RepairOrder> => {
  const url = '/api/Order/repair';

  const res = await axios.get(`${url}/DID:${displayId}`);
  return res.data;
};

export const deleteRepairOrderDIDdisplayId = async (displayId: string): Promise<void> => {
  const url = '/api/Order/repair';

  const res = await axios.delete(`${url}/DID:${displayId}`);
  return res.data;
};
