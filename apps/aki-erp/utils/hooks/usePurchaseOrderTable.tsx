import { useEffect, useMemo, useState } from 'react';

import { Option as ComboboxOption } from '@components/shared/MyCombobox';
import TablePagination from '@components/shared/TablePagination';
import { fetchPurchaseOrder } from '@data-access/apis';
import { ArtworkDetail, PurchaseOrder, Status } from '@data-access/models';
import { useQuery } from '@tanstack/react-query';
import {
  CellContext,
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classnames from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SelectItem } from './useArtworkSearches';
import useSelectionList from './useSelectionList';

export const inputColumn = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<ArtworkDetail, any>) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    (table.options.meta as any)?.updateColumnData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      className="input px-1 w-full"
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};

export const selectColumn = (
  { getValue, row: { index }, column: { id }, table }: CellContext<ArtworkDetail, any>,
  options: ComboboxOption[],
  config?: { getValue?: () => any; onChange?: (value: string) => void }
) => {
  const initialValue = config?.getValue?.() ?? getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <select
      className="input appearance-none p-0 text-center text-sm w-[3rem]"
      value={value as string}
      onChange={(e) => {
        setValue(e.target.value);
        if (config?.onChange) {
          config?.onChange?.(e.target.value);
        } else {
          (table.options.meta as any)?.updateColumnData(index, id, value);
        }
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export const usePurchaseOrderTable = ({
  status,
  columns,
  selectItems,
}: {
  status: Status;
  columns: ColumnDef<PurchaseOrder, any>[];
  selectItems?: SelectItem[];
  getSelectAllProps?: ReturnType<typeof useSelectionList>['getSelectAllProps'];
  getSelectItemProps?: ReturnType<typeof useSelectionList>['getSelectItemProps'];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams);

  // const [tableData, setTableData] = useState<PurchaseOrder[] | null | undefined>([]);

  const dataQuery = useQuery({
    queryKey: ['purchaseOrders', urlSearchParams.toString()],
    queryFn: () => fetchPurchaseOrder(status, urlSearchParams.toString()),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  // useEffect(() => {
  //   if (dataQuery.isSuccess) {
  //     const tableData = cloneDeep(dataQuery.data.data);
  //     setTableData(tableData);
  //   }
  // }, []);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: +(urlSearchParams.get('pageIndex') || 0),
    pageSize: +(urlSearchParams.get('pageSize') || 50),
  });

  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => {
    if (
      pageIndex === +(urlSearchParams.get('pageIndex') || 0) &&
      pageSize === +(urlSearchParams.get('pageSize') || 50)
    ) {
      return;
    }

    pageIndex > 0
      ? urlSearchParams.set('pageIndex', `${pageIndex}`)
      : urlSearchParams.delete('pageIndex');
    pageSize !== 50
      ? urlSearchParams.set('pageSize', `${pageSize}`)
      : urlSearchParams.delete('pageSize');

    router.push(`${pathname}?${urlSearchParams.toString()}`);
  }, [pageIndex, pageSize]);

  // const columnMutation = useMutation({
  //   mutationKey: ['updateArtwork'],
  //   mutationFn: ({ data }: { data: Partial<PurchaseOrder> }) => updateOrderPurchase(data),
  //   onError: () => {
  //     dataQuery.refetch();
  //   },
  // });

  const table = useReactTable<PurchaseOrder>({
    data: dataQuery.data?.data || [],
    columns,
    pageCount: Math.ceil((dataQuery.data?.totalCount || 0) / (dataQuery.data?.take || 0)) ?? -1,
    state: { pagination },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  return {
    dataQuery,
    table,
    tableBlock: (
      <>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="text-sm">
                  {headerGroup.headers.map((header) => {
                    return (
                      <td
                        key={header.id}
                        colSpan={header.colSpan}
                        className={classnames('p-2', {
                          'min-w-[10rem]': ![
                            'select',
                            'storeType',
                            'salesType',
                            'assetsType',
                          ].includes(header.id),
                          'min-w-[3rem]': ['storeType', 'salesType', 'assetsType'].includes(
                            header.id
                          ),
                          'text-center': ['assetsType'].includes(header.id),
                        })}
                      >
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="text-sm">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="p-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="divider mt-2" />
        <TablePagination
          {...{
            table,
            pageIndex,
            pageSize,
            totalCount: dataQuery.data?.totalCount ?? 0,
          }}
        />
      </>
    ),
  };
};
