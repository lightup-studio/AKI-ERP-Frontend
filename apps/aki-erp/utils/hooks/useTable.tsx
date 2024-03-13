import Table from '@components/shared/Table';
import TablePagination from '@components/shared/TablePagination';
import { IndeterminateCheckbox } from '@components/shared/field';
import {
  ColumnDef,
  PaginationState,
  Row,
  TableMeta,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const useTable = <T = any>({
  data = [],
  meta,
  columns,
  disabled,
  isLoading,
  totalCount = 0,
}: {
  data?: T[];
  meta?: TableMeta<T>;
  columns: ColumnDef<T, any>[];
  disabled?: boolean;
  isLoading?: boolean;
  totalCount?: number;
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

  const [rowSelection, setRowSelection] = useState<Record<string, T>>({});
  const selectedRows = useMemo(() => Object.values(rowSelection), [rowSelection]);
  const selectedRowsCount = selectedRows.length;

  const onSelectClick = (row: Row<T>) => {
    rowSelection[row.id] ? delete rowSelection[row.id] : (rowSelection[row.id] = row.original);
    setRowSelection(structuredClone(rowSelection));
  };

  const onSelectAllClick = (rows: Row<T>[]) => {
    const selectedRows = Object.keys(rowSelection);
    const isAllRowSelected = rows.length === selectedRowsCount;

    isAllRowSelected
      ? selectedRows.forEach((key) => delete rowSelection[key])
      : rows.forEach((row) => (rowSelection[row.id] = row.original));

    setRowSelection(structuredClone(rowSelection));
  };

  const selectColumn: ColumnDef<T, any> = {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center">
        {!disabled && (
          <IndeterminateCheckbox
            {...{
              checked: selectedRowsCount > 0 && selectedRowsCount === totalCount,
              indeterminate: selectedRowsCount > 0 && selectedRowsCount < totalCount,
              onChange: () => onSelectAllClick(table.getRowModel().rows),
            }}
          />
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        {!disabled && (
          <IndeterminateCheckbox
            {...{
              checked: row.id in rowSelection,
              indeterminate: false,
              onChange: () => onSelectClick(row),
            }}
          />
        )}
      </div>
    ),
  };

  const table = useReactTable<T>({
    data: isLoading ? [] : data,
    meta: meta,
    state: { pagination: { pageSize, pageIndex } },
    columns: disabled ? columns : [selectColumn, ...columns],
    pageCount: Math.ceil(totalCount / pageSize) ?? -1,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
  });

  const tableBlock = (
    <>
      <Table table={table} isLoading={isLoading} />

      <div className="divider" />

      <TablePagination
        {...{
          table,
          pageSize,
          pageIndex,
          totalCount: totalCount,
        }}
      />
    </>
  );

  return {
    table,
    tableBlock,
    rowSelection,
    selectedRows,
    selectedRowsCount,
    clearRowSelection: () => setRowSelection({}),
  };
};

export default useTable;
