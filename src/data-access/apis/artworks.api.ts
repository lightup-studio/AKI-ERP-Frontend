/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import { Artwork, ArtworkDetail, ArtworkMetadata, Pagination } from 'data-access/models';
import { chain, rangeRight } from 'lodash-es';
import { Option as ComboboxOption } from 'shared/ui/MyCombobox';
import { salesTypeOptions, storeTypeOptions } from 'src/constants/artwork.constant';

import { assetsTypeOptions } from '../../constants/artwork.constant';
import { fetchCountryList } from './countries.api';

export async function fetchSelectOptions() {
  const artworkOtherInfoOptions: ComboboxOption[] = [
    { label: '無', value: 'none' },
    { label: '裱框', value: 'framed' },
    { label: '台座', value: 'pedestal' },
    { label: '紙箱', value: 'carton' },
    { label: '木箱', value: 'wooden_box' },
  ];

  const [countryList, artistOptions, serialNumberOptions, yearOptions, mediaOptions, agentGalleryOptions] = await Promise.all([
    fetchCountryList(),
    fetchArtistOptions(),
    fetchSerialNumberOptions(),
    fetchYearOptions(),
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
    years: yearOptions,
    mediums: mediaOptions,
    agentGalleries: agentGalleryOptions,
    storeTypes: storeTypeOptions as unknown as ComboboxOption[],
    salesTypes: salesTypeOptions as unknown as ComboboxOption[],
    assetsTypes: assetsTypeOptions as unknown as ComboboxOption[],
    otherInfos: artworkOtherInfoOptions,
  } as const;

  return data;
}

export async function fetchArtistOptions() {
  const res = await axios.get<string[]>('api/Artworks/autoComplete/artist');
  return res.data.filter(Boolean).map((artist) => ({ label: artist, value: artist }));
}

export async function fetchSerialNumberOptions() {
  const res = await axios.get<string[]>('api/Artworks/autoComplete/metadata/serialNumber');
  return res.data.filter(Boolean).map((serialNumber) => ({ label: serialNumber, value: serialNumber }));
}

export function fetchYearOptions() {
  const options = rangeRight(new Date().getFullYear(), 1980).map((year) => ({ label: `${year}`, value: year }));
  return Promise.resolve(options);
}

export async function fetchMediaOptions() {
  const res = await axios.get<string[]>('api/Artworks/autoComplete/metadata/media');
  return res.data.map((media) => ({ label: media, value: media }));
}

export async function fetchAgentGalleryOptions() {
  const res = await axios.get<string[]>('api/Artworks/autoComplete/metadata/agentGalleries');
  const distinctAgentGalleries = chain(res.data)
    .map<string[]>((items) => JSON.parse(items))
    .filter((items) => items.length > 0)
    .flatMap()
    .map('name')
    .uniq()
    .value();
  return distinctAgentGalleries.map((agentGallery) => ({ label: agentGallery, value: agentGallery }));
}

export async function fetchArtworkList(searchParams: URLSearchParams) {
  const queryString = (searchParams.toString() || '')
    .replace(/artists=/g, 'artistId=')
    .replace(/storeTypes=/g, 'storeTypeId=')
    .replace(/salesTypes=/g, 'salesStatusId=')
    .replace(/assetsTypes=/g, 'assetsTypeId=')
    .replace(/pageIndex=/g, 'offset=')
    .replace(/pageSize=/g, 'take=');
  const res = await axios.get<Pagination<Artwork>>(`/api/artworks?${queryString}`);
  res.data.pageCount = Math.ceil(res.data.totalCount / res.data.take);
  return res.data;
}

export async function fetchArtworkList2(status: 'Enabled' | 'Disabled' | 'Draft' = 'Enabled', searchParams?: URLSearchParams) {
  const queryString = (searchParams ? [...searchParams.entries()] : [])
    .map(([key, value]) => {
      if (key === 'nationalities') return `countryCode=${value}`;
      if (key === 'artists') return `artistName=${value}`;
      if (key === 'storeTypes') return `metadatas={"storeType":"${value}"}`;
      if (key === 'salesTypes') return `metadatas={"salesType":"${value}"}`;
      if (key === 'assetsTypes') return `metadatas={"assetsType":"${value}"}`;
      if (key === 'serialNumbers') return `metadatas={"serialNumber":"${value}"}`;
      if (key === 'pageIndex') return `offset=${value}`;
      if (key === 'pageSize') return `take=${value}`;
      return `${key}=${value}`;
    })
    .filter(Boolean)
    .join('&');
  const res = await axios.get<Pagination<ArtworkDetail>>(`/api/artworks/query?status=${status}&${queryString}`);
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

export async function patchArtworks(ids: number[], data: Partial<ArtworkDetail<Partial<ArtworkMetadata>>>) {
  return Promise.all(ids.map((id) => patchArtwork(id, data)));
}

export async function patchArtwork(id: number, data: Partial<ArtworkDetail<Partial<ArtworkMetadata>>>) {
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
