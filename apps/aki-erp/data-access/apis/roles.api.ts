import axios from '@contexts/axios';
import { Role } from '@data-access/models';

const url = '/api/Roles';

export const fetchRoles = async (): Promise<Role[]> => {
  const res = await axios.get(url);
  return res.data;
};
