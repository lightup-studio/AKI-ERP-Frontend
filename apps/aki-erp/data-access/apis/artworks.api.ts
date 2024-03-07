import { rangeRight } from 'lodash-es';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Option as ComboboxOption } from '@components/shared/MyCombobox';
import { assetsTypeOptions, salesTypeOptions, storeTypeOptions } from '@constants/artwork.constant';
import axios from '@contexts/axios';
import {
  ArtworkDetail,
  ArtworkMetadata,
  CommonBatchPartialUpdateById,
  Pagination,
} from '@data-access/models';

import { fetchCountryList } from './countries.api';

export async function fetchSelectOptions() {
  const artworkOtherInfoOptions: ComboboxOption[] = [
    { label: '無', value: 'none' },
    { label: '裱框', value: 'framed' },
    { label: '台座', value: 'pedestal' },
    { label: '紙箱', value: 'carton' },
    { label: '木箱', value: 'wooden_box' },
  ];

  const [
    countryList,
    artistOptions,
    serialNumberOptions,
    yearAgeOptions,
    mediaOptions,
    agentGalleryOptions,
  ] = await Promise.all([
    fetchCountryList(),
    fetchArtistOptions(),
    fetchSerialNumberOptions(),
    fetchYearAgeOptions(),
    fetchMediaOptions(),
    fetchAgentGalleryOptions(),
  ]);

  const data = {
    nationalities: countryList.map<ComboboxOption>(({ alpha3Code, zhName }) => ({
      label: zhName,
      value: alpha3Code,
    })),
    artists: artistOptions,
    serialNumbers: serialNumberOptions,
    yearAges: yearAgeOptions,
    mediums: mediaOptions,
    agentGalleries: agentGalleryOptions,
    storeTypes: [...storeTypeOptions],
    salesTypes: [...salesTypeOptions],
    assetsTypes: [...assetsTypeOptions],
    otherInfos: artworkOtherInfoOptions,
  } as const;

  return data;
}

export async function fetchArtistOptions() {
  const res = await axios.get<string[]>('/api/Artworks/autoComplete/artist');
  return res.data.filter(Boolean).map((artist) => ({ label: artist, value: artist }));
}

export async function fetchSerialNumberOptions() {
  const res = await axios.get<string[]>('/api/Artworks/autoComplete/metadata/serialNumber');
  return res.data
    .filter(Boolean)
    .map((serialNumber) => ({ label: serialNumber, value: serialNumber }));
}

export async function fetchYearAgeOptions() {
  try {
    const res = await axios.get<string[]>('/api/Artworks/autoComplete/yearAge');
    return res.data.sort((a, b) => +b - +a).map((yearAge) => ({ label: yearAge, value: yearAge }));
  } catch {
    const options = rangeRight(new Date().getFullYear(), 1980).map((year) => ({
      label: `${year}`,
      value: year.toString(),
    }));

    return Promise.resolve(options);
  }
}

export async function fetchMediaOptions() {
  const res = await axios.get<string[]>('/api/Artworks/autoComplete/metadata/media');
  return res.data.map((media) => ({ label: media, value: media }));
}

export async function fetchAgentGalleryOptions() {
  const res = await axios.get<string[]>('/api/Artworks/autoComplete/metadata/agentGalleries');

  const distinctAgentGalleries = res.data
    .map((item) => JSON.parse(item))
    .filter((item) => item.length)
    .flatMap((item) => item.flatMap((item: { name: string }) => item.name));

  return distinctAgentGalleries.map((agentGallery) => ({
    label: agentGallery,
    value: agentGallery,
  }));
}

export async function fetchArtworkList(
  status: 'Enabled' | 'Disabled' | 'Draft' = 'Enabled',
  searchParams?: URLSearchParams,
) {
  const queryString = (searchParams ? [...searchParams.entries()] : [])
    .map(([key, value]) => {
      if (key === 'nationalities') return `countryCode=${value}`;
      if (key === 'artists') return `artistName=${value}`;
      if (key === 'otherInfos') return `metadatas={"otherInfo":"{'${value}':'true'}"}`;
      if (key === 'storeTypes') return `metadatas={"storeType":"${value}"}`;
      if (key === 'salesTypes') return `metadatas={"salesType":"${value}"}`;
      if (key === 'assetsTypes') return `metadatas={"assetsType":"${value}"}`;
      if (key === 'serialNumbers') return `metadatas={"serialNumber":"${value}"}`;
      if (key === 'agentGalleries') return `metadatas={"agentGalleries":"[{'name':'${value}'}]"}`;
      if (key === 'pageIndex') {
        const pageIndex = +(searchParams?.get('pageIndex') || 0);
        const pageSize = +(searchParams?.get('pageSize') || 50);
        return `offset=${pageIndex * pageSize}`;
      }
      if (key === 'pageSize') return `take=${value}`;
      return `${key}=${value}`;
    })
    .filter(Boolean)
    .join('&');
  const res = await axios.get<Pagination<ArtworkDetail>>(`/api/artworks/query`, {
    params: new URLSearchParams(`status=${status}&${queryString}`),
  });
  res.data.pageCount = Math.ceil(res.data.totalCount / res.data.take);
  return res.data;
}

export async function fetchArtworkDetail(id: string) {
  const res = await axios.get<ArtworkDetail>(`/api/Artworks/${id}`);
  return res.data;
}

export async function fetchArtworkDetailByDisplayId(displayId: string) {
  const res = await axios.get<ArtworkDetail>(`/api/Artworks/DID:${displayId}`);
  return res.data;
}

export async function createOrUpdateArtworkDetail(artwork: ArtworkDetail) {
  const res = await axios.put('/api/Artworks', artwork, {
    params: {
      allowCreate: true,
    },
  });
  return res.data;
}

export async function patchArtworks(
  ids: number[],
  data: Partial<ArtworkDetail<Partial<ArtworkMetadata>>>,
) {
  return Promise.all(ids.map((id) => patchArtwork(id, data)));
}

export async function patchArtwork(
  id: number,
  data: Partial<ArtworkDetail<Partial<ArtworkMetadata>>>,
) {
  const res = await axios.patch(`/api/Artworks/${id}`, data);
  return res.data;
}

export async function deleteArtworks(ids: number[]) {
  return Promise.all(ids.map((id) => deleteArtwork(id)));
}

export async function deleteArtwork(id: number) {
  const res = await axios.delete(`/api/Artworks/${id}`);
  return res.data;
}

export async function patchArtworksBatchId(
  data?: CommonBatchPartialUpdateById,
): Promise<Array<ArtworkDetail>> {
  const res = await axios.patch(`/api/Artworks/batch/id`, data);
  return res.data;
}
