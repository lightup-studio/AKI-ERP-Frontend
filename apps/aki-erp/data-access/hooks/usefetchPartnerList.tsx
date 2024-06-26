import { DEFAULT_PAGE_SIZE } from '@constants/page.constant';
import { fetchPartnerList } from '@data-access/apis/partners.api';
import { PartnerType } from '@data-access/models';
import { useQuery } from '@tanstack/react-query';

export const usefetchPartnerList = <
  TPartnerType extends PartnerType | undefined | null = undefined | null,
>({
  type,
  keyword,
  pageIndex = 0,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  type?: TPartnerType;
  keyword?: string | null;
  pageIndex?: number;
  pageSize?: number;
}) => {
  return useQuery(
    ['usefetchPartnerList', type, keyword, pageIndex, pageSize],
    () =>
      fetchPartnerList({
        type,
        keyword,
        pageIndex,
        pageSize,
      }),
    { keepPreviousData: true },
  );
};
