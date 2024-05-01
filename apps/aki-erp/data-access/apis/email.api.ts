import axios from '@contexts/axios';

const url = '/api/Email';

export const sendEmailAuth = async (userId?: number, roleId?: number): Promise<void> => {
  const res = await axios.post(`${url}/auth?userId=${userId}&roleId=${roleId}`);
  return res.data;
};

export const verifyEmail = async (code?: string): Promise<void> => {
  const res = await axios.post(`${url}/verify?code=${code}`);
  return res.data;
};
