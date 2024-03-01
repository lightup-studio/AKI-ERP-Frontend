import { fetchPartnerList } from '@data-access/apis/partners.api';
import { PartnerType } from '@data-access/models';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

export const usefetchPartnerList = <
  TPartnerType extends PartnerType | undefined | null = undefined | null,
>(
  type: TPartnerType,
) => {
  const searchParams = useSearchParams();

  return useQuery(
    [type, searchParams.toString()],
    () =>
      fetchPartnerList({
        type,
        keyword: searchParams.get('keyword'),
        pageIndex: +(searchParams.get('pageIndex') || 0),
        pageSize: +(searchParams.get('pageSize') || 50),
      }),
    { keepPreviousData: true },
  );
};
