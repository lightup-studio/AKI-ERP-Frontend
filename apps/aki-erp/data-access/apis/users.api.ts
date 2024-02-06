import axios from '@contexts/axios';
import { Pagination, User } from '@data-access/models';

const url = '/api/Users';

export const fetchUsers = async (queryString?: string): Promise<Pagination<User>> => {
  const params = new URLSearchParams(queryString);
  const pageIndex = +(params.get('pageIndex') || 0);
  const pageSize = +(params.get('pageSize') || 50);
  const offset = pageIndex * pageSize;

  const res = await axios.get(url);
  return {
    data: res.data.slice(offset, offset + pageSize),
    offset: offset,
    take: pageSize,
    pageCount: Math.ceil(res.data.length / pageSize),
    totalCount: res.data.length,
  };
};

export const fetchUsersId = async (id: string): Promise<User> => {
  const res = await axios.get(`${url}/${id}`);
  return res.data;
};

export const createUser = async (body?: User): Promise<User> => {
  const res = await axios.post(url, body);
  return res.data;
};

export const updateUser = async (id?: number, body?: User): Promise<User> => {
  const res = await axios.patch(`${url}/${id}`, body);
  return res.data;
};

export const deleteUser = async (id?: number): Promise<void> => {
  const res = await axios.delete(`${url}/${id}`);
  return res.data;
};
