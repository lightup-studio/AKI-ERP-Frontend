import axios from '@contexts/axios';
import { AuthorizeWithPasswordResponse } from '@data-access/models';

export async function authorizeWithPassword(username: string, password: string) {
  const url = '/api/Authorizations/authorize/password';

  const res = await axios.post<AuthorizeWithPasswordResponse>(url, { username, password });
  return res.data;
}
