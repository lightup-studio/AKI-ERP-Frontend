/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import { ApiResponse, Artwork, ArtworkDetail, Pagination } from 'data-access/models';

export async function fetchSelectOptions() {
  const res = await axios.get<
    ApiResponse<Record<string, { label: string; value: string }[]>>
  >('/api/artworks/select_options');
  return res.data.data;
}

export async function fetchArtworkList(searchParams: URLSearchParams) {
  const res = await axios.get<ApiResponse<Pagination<Artwork>>>(
    `/api/artworks?${searchParams}`
  );
  return res.data.data;
}

export async function fetchArtworkDetail(id: string): Promise<ArtworkDetail> {
  return Promise.resolve({
    image: '',
    artistNames: [{ chineseName: '', englishName: '' }],

    assetCategory: '',
    type: '',
    agentGalleries: [{ name: '' }],
    nationality: '',

    name: '',
    length: '',
    width: '',
    height: '',
    customSize: '',
    serialNumber: '',
    media: '',
    year: '',
    edition: '',

    otherInfo: {
      frame: false,
      frameDimensions: '',
      pedestal: false,
      pedestalDimensions: '',
      cardboardBox: false,
      woodenBox: false,
    },

    stockLocationId: '',
    stockStatus: {
      id: '',
      unitText: '',
      remark: '',
    },
  });
}

export async function updateArtworkDetail(id: string, artwork: ArtworkDetail) {
  return Promise.resolve();
}