import axios from '@contexts/axios';
import { Artist, Pagination } from '@data-access/models';

export async function fetchArtistList({
  countryCode,
  offset = 0,
  take = 10,
}: {
  countryCode?: string;
  offset?: number;
  take?: number;
} = {}) {
  const res = await axios.get<Pagination<Artist>>('/api/Artists', {
    params: {
      countryCode,
      offset,
      take,
    },
  });
  return res.data;
}
