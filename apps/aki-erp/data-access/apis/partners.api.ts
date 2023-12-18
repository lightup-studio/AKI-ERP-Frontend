import axios from '@contexts/axios';
import { Pagination, Partner, PartnerType } from '@data-access/models';

export async function fetchPartnerList<
  TPartnerType extends PartnerType | undefined | null = undefined | null,
>({
  type,
  keyword,
  pageIndex = 0,
  pageSize = 50,
}: {
  type?: TPartnerType;
  keyword?: string | null;
  pageIndex?: number;
  pageSize?: number;
} = {}): Promise<Pagination<Partner<TPartnerType>>> {
  const res = await axios.get<Partner<TPartnerType>[]>(`/api/partners`, {
    params: {
      ...(type && { type }),
      ...(keyword && { keyword }),
    },
  });
  return {
    data: res.data
      .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())
      .slice(pageIndex * pageSize, pageSize),
    offset: pageIndex * pageSize,
    take: pageSize,
    pageCount: Math.ceil(res.data.length / pageSize),
    totalCount: res.data.length,
  };
}

export async function createPartner<
  TPartnerType extends PartnerType | undefined | null = undefined | null,
>(partner: Partner<TPartnerType>) {
  const res = await axios.post<Partner<TPartnerType>>(`/api/partners`, partner);
  return res.data;
}

export async function updatePartner<
  TPartnerType extends PartnerType | undefined | null = undefined | null,
>(partner: Partner<TPartnerType>) {
  const res = await axios.put<Partner<TPartnerType>>(`/api/partners`, partner);
  return res.data;
}

export async function deletePartner(id: Partner['id']) {
  await axios.delete(`/api/partners/${id}`);
}

export async function deletePartnerList(ids: Partner['id'][]) {
  await Promise.all(ids.map((id) => deletePartner(id)));
}
