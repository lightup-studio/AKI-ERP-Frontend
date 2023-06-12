/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import {
  ApiResponse,
  Artwork,
  ArtworkDetail,
  AssetsType,
  Pagination,
  SalesType,
  StoreType,
} from 'data-access/models';
import { Option as ComboboxOption } from 'shared/ui/MyCombobox';

import { fetchArtistList } from './artists.api';
import { fetchCountryList } from './countries.api';

export async function fetchSelectOptions() {
  const serialNumberOptions: ComboboxOption[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];
  const mediumOptions: ComboboxOption[] = [
    { label: '油彩', value: 'oil_paint' },
    { label: '壓克力', value: 'acrylic_paint' },
    { label: '水彩', value: 'watercolor_paint' },
    { label: '鉛筆', value: 'pencil' },
    { label: '木刻', value: 'woodcut' },
    { label: '銅版畫', value: 'copperplate_print' },
    { label: '石版畫', value: 'stone_print' },
    { label: '攝影', value: 'photography' },
    { label: '雕塑', value: 'sculpture' },
    { label: '陶瓷', value: 'ceramics' },
    { label: '玻璃', value: 'glass' },
    { label: '金屬', value: 'metal' },
    { label: '紙本', value: 'paper' },
    { label: '綜合媒材', value: 'mixed_media' },
  ];
  const agentGalleryOptions: ComboboxOption[] = [
    { label: '玄之又玄畫廊', value: 'Gallery Xuan' },
    { label: '台北當代藝術館', value: 'Taipei Fine Arts Museum' },
    { label: '南海藝廊', value: 'Nanhai Gallery' },
    { label: '大英圖書館畫廊', value: 'British Library Gallery' },
    { label: '紐約現代美術館', value: 'Museum of Modern Art, New York' },
    { label: '中央美術學院美術館', value: 'CAFA Art Museum' },
    { label: '雙十畫廊', value: 'Double Square Gallery' },
    { label: '柏林國家畫廊', value: 'National Gallery Berlin' },
    { label: '益田畫廊', value: 'Yidan Art Gallery' },
    {
      label: '巴黎杜魯門藝術中心',
      value: 'Centre Georges Pompidou, Paris',
    },
  ];
  const artworkOtherInfoOptions: ComboboxOption[] = [
    { label: '無', value: 'none' },
    { label: '裱框', value: 'framed' },
    { label: '台座', value: 'pedestal' },
    { label: '紙箱', value: 'carton' },
    { label: '木箱', value: 'wooden_box' },
  ];

  const [
    countryList,
    artistList,
    _serialNumberOptions,
    yearList,
    storeTypeList,
    salesTypeList,
    assetsTypeList,
    _mediumOptions,
    _agentGalleryOptions,
    _artworkOtherInfoOptions,
  ] = await Promise.all([
    fetchCountryList(),
    fetchArtistList({
      take: 100_000_000,
    }),
    Promise.resolve(serialNumberOptions),
    fetchYears(),
    fetchStoreTypes(),
    fetchSalesTypes(),
    fetchAssetsTypes(),
    Promise.resolve(mediumOptions),
    Promise.resolve(agentGalleryOptions),
    Promise.resolve(artworkOtherInfoOptions),
  ]);

  const data = {
    nationalities: countryList.map<ComboboxOption>(
      ({ alpha3Code, nameZh }) => ({
        label: nameZh,
        value: alpha3Code,
      })
    ),
    artists: artistList.data.map<ComboboxOption>(
      ({ id, zhLastname, zhName, enLastname, enName }) => ({
        label: `${zhLastname} ${zhName} ${enLastname} ${enName}`,
        value: `${id}`,
      })
    ),
    serialNumbers: _serialNumberOptions,
    years: yearList.map<ComboboxOption>((year) => ({
      label: year,
      value: year,
    })),
    storeTypes: storeTypeList.map<ComboboxOption>(({ id, name }) => ({
      label: name,
      value: `${id}`,
    })),
    salesTypes: salesTypeList.map<ComboboxOption>(({ id, name }) => ({
      label: name,
      value: `${id}`,
    })),
    assetsTypes: assetsTypeList.map<ComboboxOption>(({ id, name }) => ({
      label: name,
      value: `${id}`,
    })),
    mediums: _mediumOptions,
    agentGalleries: _agentGalleryOptions,
    otherInfos: _artworkOtherInfoOptions,
  } as const;

  return data;
}

export async function fetchAssetsTypes() {
  const res = await axios.get<AssetsType[]>('/api/Artworks/assetsTypes');
  return res.data;
}

export async function fetchStoreTypes() {
  const res = await axios.get<StoreType[]>('/api/Artworks/storeTypes');
  return res.data;
}

export async function fetchSalesTypes() {
  const res = await axios.get<SalesType[]>('/api/Artworks/salesTypes');
  return res.data;
}

export async function fetchYears() {
  const res = await axios.get<string[]>('/api/Artworks/years');
  return res.data;
}

export async function fetchArtworkList(searchParams: URLSearchParams) {
  const queryString = (searchParams.toString() || '')
    .replace(/artists=/g, 'artistId=')
    .replace(/storeTypes=/g, 'storeTypeId=')
    .replace(/salesTypes=/g, 'salesStatusId=')
    .replace(/assetsTypes=/g, 'assetsTypeId=')
    .replace(/pageIndex=/g, 'offset=')
    .replace(/pageSize=/g, 'take=');
  const res = await axios.get<Pagination<Artwork>>(
    `/api/artworks?${queryString}`
  );
  res.data.pageCount = Math.ceil(res.data.totalCount / res.data.take);
  return res.data;
}

export async function fetchArtworkDetail(id: string): Promise<ArtworkDetail> {
  return Promise.resolve<ArtworkDetail>({
    image: '',
    artistNames: [{ chineseName: '', englishName: '' }],

    assetCategory: '',
    type: '',
    agentGalleries: [{ name: '' }],
    nationality: '',

    purchasingUnit: '',
    name: '',
    length: '',
    width: '',
    height: '',
    customSize: '',
    serialNumber: '',

    media: '',
    startYear: null,
    endYear: null,
    edition: '',

    otherInfo: {
      frame: false,
      frameDimensions: '',
      pedestal: false,
      pedestalDimensions: '',
      cardboardBox: false,
      woodenBox: false,
    },

    warehouseId: 'B',
    warehouseLocation: '',
  });
}

export async function updateArtworkDetail(id: string, artwork: ArtworkDetail) {
  return Promise.resolve();
}
