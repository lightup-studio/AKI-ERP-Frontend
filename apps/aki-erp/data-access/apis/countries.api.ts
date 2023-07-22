import { Country } from '@data-access/models';
import axios from 'axios';

export async function fetchCountryList({
  onlyAvailable = false,
}: {
  onlyAvailable?: boolean;
} = {}) {
  const res = await axios.get<Country[]>('/api/Countries', {
    params: {
      onlyAvailable,
    },
  });
  return res.data;
}
