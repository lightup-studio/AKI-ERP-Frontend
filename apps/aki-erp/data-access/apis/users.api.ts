import axios from '@contexts/axios';
import { User } from '@data-access/models';

export const fetchUsersId = async (id: string): Promise<User> => {
  const url = '/api/Users';

  const res = await axios.get(`${url}/${id}`);
  return res.data;
};
