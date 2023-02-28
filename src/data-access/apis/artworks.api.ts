/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import { ApiResponse, Artwork, Pagination } from 'data-access/models';

export async function fetchSelectOptions() {
  const res = await axios.get<
    ApiResponse<Record<string, { label: string; value: string }[]>>
  >('/api/artworks/select_options');
  return res.data.data;
}

export async function fetchData(option: {
  pageIndex: number;
  pageSize: number;
}) {
  const res = await axios.get<ApiResponse<Pagination<Artwork>>>(
    '/api/artworks',
    {
      params: {
        pageIndex: option.pageIndex,
        pageSize: option.pageSize,
      },
    }
  );
  return res.data.data;
}
