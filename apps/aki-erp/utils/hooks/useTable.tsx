import Table from '@components/shared/Table';
import TablePagination from '@components/shared/TablePagination';
import { Pagination } from '@data-access/models';
import { ColumnDef, PaginationState, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useTable = <T = any,>({
  data,
  columns,
  isLoading,
}: {
  data?: Omit<Pagination<T>, 'take' | 'offset' | 'pageCount'>;
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);
  const [{ pageSize, pageIndex }, setPagination] = useState<PaginationState>({
    pageSize: +(params.get('pageSize') || 50),
    pageIndex: +(params.get('pageIndex') || 0),
  });

  useEffect(() => {
    if (
      pageSize === +(params.get('pageSize') || 50) &&
      pageIndex === +(params.get('pageIndex') || 0)
    ) {
      return;
    }

    pageSize !== 50 ? params.set('pageSize', `${pageSize}`) : params.delete('pageSize');
    pageIndex > 0 ? params.set('pageIndex', `${pageIndex}`) : params.delete('pageIndex');

    router.push(`${pathname}?${params.toString()}`);
  }, [pageSize, pageIndex]);

  const table = useReactTable<T>({
    data: data?.data || [],
    state: { pagination: { pageSize, pageIndex } },
    columns,
    pageCount: Math.ceil((data?.totalCount || 0) / pageSize) ?? -1,
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
            pageSize,
            pageIndex,
            totalCount: data?.totalCount ?? 0,
          }}
        />
      </>
    ),
  };
};

export default useTable;
