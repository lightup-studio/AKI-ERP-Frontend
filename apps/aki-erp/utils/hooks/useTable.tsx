import { useEffect, useMemo, useState } from 'react';

import Table from '@components/shared/Table';
import TablePagination from '@components/shared/TablePagination';
import { Pagination } from '@data-access/models';
import { ColumnDef, PaginationState, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import useSelectionList from './useSelectionList';

const useTable = <T = any,>({
  data,
  columns,
  isLoading,
}: {
  data?: Pagination<T>;
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  getSelectAllProps?: ReturnType<typeof useSelectionList>['getSelectAllProps'];
  getSelectItemProps?: ReturnType<typeof useSelectionList>['getSelectItemProps'];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: +(params.get('pageIndex') || 0),
    pageSize: +(params.get('pageSize') || 50),
  });

  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => {
    if (
      pageIndex === +(params.get('pageIndex') || 0) &&
      pageSize === +(params.get('pageSize') || 50)
    )
      return;

    pageIndex > 0 ? params.set('pageIndex', `${pageIndex}`) : params.delete('pageIndex');
    pageSize !== 50 ? params.set('pageSize', `${pageSize}`) : params.delete('pageSize');

    router.push(`${pathname}?${params.toString()}`);
  }, [pageIndex, pageSize]);

  const pageCount = Math.ceil((data?.totalCount || 0) / (data?.take || 0)) ?? -1;
  const table = useReactTable<T>({
    data: data?.data || [],
    state: { pagination },
    columns,
    pageCount: pageCount,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  return {
    table,
    tableBlock: (
      <>
        <Table table={table} isLoading={isLoading} />

        <div className="divider mt-2" />

        <TablePagination
          {...{
            table,
            pageIndex,
            pageSize,
            totalCount: data?.totalCount ?? 0,
          }}
        />
      </>
    ),
  };
};

export default useTable;
