import axios from '@contexts/axios';
import { AuthorizeWithPasswordResponse } from '@data-access/models';

const url = '/api/Authorizations';

export async function authorizeWithPassword(username: string, password: string) {
  const res = await axios.post<AuthorizeWithPasswordResponse>(`${url}/authorize/password`, {
    username,
    password,
  });
  return res.data;
}

export async function authorizeWithPasswordByUserId(userId?: number, password?: string) {
  const res = await axios.post<AuthorizeWithPasswordResponse>(`${url}/${userId}/password`, {
    password,
  });
  return res.data;
}
