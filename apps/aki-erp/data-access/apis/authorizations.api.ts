import { AuthorizeWithPasswordResponse } from '@data-access/models';
import axios from 'axios';

export async function authorizeWithPassword(username: string, password: string) {
  const res = await axios.post<AuthorizeWithPasswordResponse>(
    '/api/Authorizations/authorize/password',
    {
      username,
      password,
    }
  );
  return res.data;
}
