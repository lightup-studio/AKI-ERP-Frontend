/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import classnames from 'classnames';
import { fetchArtworkList2, patchArtwork } from 'data-access/apis/artworks.api';
import { ArtworkDetail } from 'data-access/models';
import { cloneDeep } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import { Option as ComboboxOption } from 'shared/ui/MyCombobox';

import { useMutation, useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';

import TablePagination from '../../../shared/ui/TablePagination';
import { SelectItem } from './useArtworkSearches';
import { useSelectionList } from './useSelectionList';

// Give our default column cell renderer editing superpowers!
export const inputColumn = ({ getValue, row: { index }, column: { id }, table }: CellContext<ArtworkDetail, any>) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    (table.options.meta as any)?.updateColumnData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input className="input px-1 w-full" value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
};

// Give our default column cell renderer editing superpowers!
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

export const useArtworkTable = ({
  status,
  columns,
  selectItems,
  searchParams,
  setSearchParams,
}: {
  status: ArtworkDetail['status'];
  columns: ColumnDef<ArtworkDetail, any>[];
  selectItems?: SelectItem[];
  searchParams?: URLSearchParams;
  setSearchParams?: ReturnType<typeof useSearchParams>[1];
  getSelectAllProps?: ReturnType<typeof useSelectionList>['getSelectAllProps'];
  getSelectItemProps?: ReturnType<typeof useSelectionList>['getSelectItemProps'];
}) => {
  const dataQuery = useQuery({
    queryKey: ['data', searchParams?.toString()],
    queryFn: () => fetchArtworkList2(status, searchParams),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  const [tableData, setTableData] = useState<ArtworkDetail[]>([]);

  useEffect(() => {
    if (dataQuery.isSuccess) {
      const tableData = cloneDeep(dataQuery.data.data);
      setTableData(tableData);
    }
  }, [dataQuery.isSuccess, dataQuery.data]);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: +(searchParams?.get('pageIndex') || 0),
    pageSize: +(searchParams?.get('pageSize') || 50),
  });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex === +(searchParams?.get('pageIndex') || 0) && pageSize === +(searchParams?.get('pageSize') || 50)) {
      return;
    }
    setSearchParams?.(
      (searchParams) => {
        pageIndex > 0 ? searchParams.set('pageIndex', `${pageIndex}`) : searchParams.delete('pageIndex');
        pageSize !== 50 ? searchParams.set('pageSize', `${pageSize}`) : searchParams.delete('pageSize');
        return searchParams;
      },
      {
        replace: true,
      }
    );
  }, [pageIndex, pageSize, searchParams, setSearchParams]);

  const columnMutation = useMutation({
    mutationKey: ['updateArtwork'],
    mutationFn: ({ id, data }: { id: number; data: Partial<ArtworkDetail> }) => patchArtwork(id, data),
    onError: () => {
      dataQuery.refetch();
    },
  });

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
    meta: {
      updateColumnData: function <TColumnId extends keyof ArtworkDetail>(
        rowIndex: number,
        columnId: TColumnId,
        value: ArtworkDetail[TColumnId]
      ) {
        const currentRow = table.getRowModel().rows[rowIndex];
        const id = currentRow.original.id;

        setTableData((tableData) =>
          tableData.map((row) => {
            if (row.id === id) {
              return {
                ...row,
                [columnId]: value,
              } as ArtworkDetail;
            }
            return row;
          })
        );

        columnMutation.mutate({
          id,
          data: {
            [columnId]: value,
          },
        });
      },
    },
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
                          'min-w-[10rem]': !['select', 'storeType', 'salesType', 'assetsType'].includes(header.id),
                          'min-w-[3rem]': ['storeType', 'salesType', 'assetsType'].includes(header.id),
                          'text-center': ['assetsType'].includes(header.id),
                        })}
                      >
                        {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
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
