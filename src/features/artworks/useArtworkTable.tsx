/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';

import classnames from 'classnames';
import { fetchArtworkList2, patchArtwork } from 'data-access/apis/artworks.api';
import { ArtworkDetail } from 'data-access/models';
import { cloneDeep } from 'lodash';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { Link, useSearchParams } from 'react-router-dom';
import IndeterminateCheckbox from 'shared/ui/IndeterminateCheckbox';
import { Option as ComboboxOption } from 'shared/ui/MyCombobox';
import { assetsTypeOptions, salesTypeOptions, storeTypeOptionMap } from 'src/constants/artwork.constant';

import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';

import TablePagination from './TablePagination';
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
  selectItems,
  searchParams,
  setSearchParams,
}: {
  selectItems?: SelectItem[];
  searchParams?: URLSearchParams;
  setSearchParams?: ReturnType<typeof useSearchParams>[1];
  getSelectAllProps?: ReturnType<typeof useSelectionList>['getSelectAllProps'];
  getSelectItemProps?: ReturnType<typeof useSelectionList>['getSelectItemProps'];
}) => {
  const dataQuery = useQuery({
    queryKey: ['data', searchParams?.toString()],
    queryFn: () => fetchArtworkList2('Draft', searchParams),
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

  const { getSelectAllProps, getSelectItemProps, selectedRowCount, handleDelete } = useSelectionList<ArtworkDetail>();

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="px-1">
          <IndeterminateCheckbox {...getSelectAllProps(table.getRowModel().rows, dataQuery.data?.totalCount || 0)} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox {...getSelectItemProps(row)} />
        </div>
      ),
    },
    {
      header: '編號',
      accessorKey: 'displayId',
      cell: ({ cell }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          to={cell.getValue() + (searchParams?.toString() && '?' + searchParams?.toString())}
        >
          {cell.getValue()}
          <PencilSquareIcon className="h-4 w-4 ml-2 inline-block"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '作品名稱',
      accessorKey: 'enName',
      cell: inputColumn,
    },
    {
      header: '作品圖',
      accessorKey: 'displayImageUrl',
      cell: ({ cell }) => (
        <div>
          <DialogTrigger>
            <Button>
              <img src={cell.getValue()} alt="Artwork" loading="lazy" className="h-20" />
            </Button>
            <Popover placement="right">
              <Dialog className="h-[80vh]">
                <img src={cell.getValue()} alt="Artwork" className="w-full h-full object-contain" loading="lazy" />
              </Dialog>
            </Popover>
          </DialogTrigger>
        </div>
      ),
    },
    {
      header: '藝術家',
      accessorKey: 'artists',
      cell: ({ cell }) => (
        <div>
          {cell
            .getValue<ArtworkDetail['artists']>()
            ?.map((artist) => `${artist.zhName} ${artist.enName}`)
            .join(',')}
        </div>
      ),
    },
    {
      id: 'media',
      header: '媒材',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => cell.getValue()?.media ?? '無',
    },
    {
      id: 'size',
      header: '尺寸',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const { length, width, height } = cell.getValue<ArtworkDetail['metadata']>() || {};
        const lengthText = length && `長 ${length}`;
        const widthText = width && `寬 ${width}`;
        const heightText = height && `高 ${height}`;
        return lengthText && widthText && heightText
          ? `${lengthText} x ${widthText} x ${heightText}`
          : widthText && heightText
          ? `${widthText} x ${heightText}`
          : lengthText && widthText
          ? `${lengthText} x ${widthText}`
          : lengthText
          ? `${lengthText}`
          : widthText
          ? `${widthText}`
          : heightText
          ? `${heightText}`
          : '無';
      },
    },
    {
      id: 'year',
      header: '年代',
      cell: ({ row }) => {
        const { yearRangeStart, yearRangeEnd } = row.original;
        return yearRangeStart === yearRangeEnd
          ? yearRangeStart && yearRangeStart !== 0
            ? yearRangeEnd
            : '無'
          : `${yearRangeStart}~${yearRangeEnd}`;
      },
    },
    {
      id: 'otherInfo',
      header: '其他資訊',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const { frame, frameDimensions, pedestal, pedestalDimensions, cardboardBox, woodenBox } = cell.getValue()?.otherInfo || {};
        if (frame) return `表框${frameDimensions && `，尺寸 ${frameDimensions}`}`;
        if (pedestal) return `台座${pedestalDimensions && `，尺寸 ${pedestalDimensions}`}`;
        if (cardboardBox) return '紙箱';
        if (woodenBox) return '木箱';
        return '無';
      },
    },
    {
      id: 'storeType',
      header: '庫存狀態',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const storeTypeId = cell.getValue()?.storeType ?? 'inStock';
        return storeTypeOptionMap[storeTypeId].label;
      },
    },
    {
      id: 'salesType',
      header: '銷售狀態',
      accessorKey: 'metadata',
      cell: (cellContext: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const {
          getValue,
          row: { index },
          table,
        } = cellContext;
        return selectColumn(cellContext, [...salesTypeOptions], {
          getValue: () => getValue()?.salesType ?? 'unsold',
          onChange: (value) => {
            (table.options.meta as any)?.updateColumnData(index, 'metadata', {
              ...(getValue() || {}),
              salesType: value,
            });
          },
        });
      },
    },
    {
      id: 'assetsType',
      header: '資產類型',
      accessorKey: 'metadata',
      cell: (cellContext: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const {
          getValue,
          row: { index },
          table,
        } = cellContext;
        return selectColumn(cellContext, [...assetsTypeOptions], {
          getValue: () => getValue()?.assetsType ?? 'A',
          onChange: (value) => {
            (table.options.meta as any)?.updateColumnData(index, 'metadata', {
              ...(getValue() || {}),
              assetsType: value,
            });
          },
        });
      },
    },
  ];

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
    selectedRowCount,
    handleDelete,
    tableBlock: (
      <div className="h-full w-full pb-6 bg-base-100 text-center">
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
                          'text-center': ['media', 'assetsType'].includes(header.id),
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
      </div>
    ),
  };
};
