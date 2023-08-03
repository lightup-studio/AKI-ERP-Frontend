import axios from '@contexts/axios';
import { Country } from '@data-access/models';

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
