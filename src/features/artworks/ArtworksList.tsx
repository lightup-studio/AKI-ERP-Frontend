import React, { useCallback, useEffect, useState } from 'react';

import classnames from 'classnames';
import { fetchData, fetchSelectOptions } from 'data-access/apis/artworks.api';
import { Artwork } from 'data-access/models';
import { useSearchParams } from 'react-router-dom';

import { XMarkIcon } from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  Row,
  useReactTable,
} from '@tanstack/react-table';

import { IndeterminateCheckbox } from './components/IndeterminateCheckbox';
import MyCombobox, { Option as ComboboxOption } from './components/MyCombobox';
import SearchInput from './components/SearchInput';
import { DOTS, usePagination } from './hooks/usePagination';
import { removeSingleValueForSearchParams } from './utils';

type SelectItem = {
  key: string;
  placeholder: string;
  options: ComboboxOption[];
};

type SelectedOption = ComboboxOption & {
  selectItemKey: string;
};

const SELECT_ITEMS = [
  { key: 'nationalities', placeholder: '國籍' },
  { key: 'artists', placeholder: '藝術家' },
  { key: 'editions', placeholder: '號數' },
  { key: 'years', placeholder: '年代' },
  { key: 'stockStatus', placeholder: '庫存狀態' },
  { key: 'salesStatus', placeholder: '銷售狀態' },
  { key: 'assetCategories', placeholder: '資產類別' },
  { key: 'mediums', placeholder: '媒材' },
  { key: 'agentGalleries', placeholder: '藝廊資訊' },
  { key: 'otherInfos', placeholder: '其他資訊' },
];

function ArtworksList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState<
    Record<Artwork['id'], Artwork>
  >({});

  const handleAllRowSelectionChange = (rows: Row<Artwork>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      selectedRows.forEach(
        (row) => (rowSelection[row.original.id] = row.original)
      );
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<Artwork>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  const selectOptionsQuery = useQuery({
    queryKey: ['selectOptions'],
    queryFn: fetchSelectOptions,
  });

  const [selectItems, setSelectItems] = useState<SelectItem[]>();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  useEffect(() => {
    if (selectOptionsQuery.isSuccess) {
      const selectItems = SELECT_ITEMS.filter(
        (item) => item.key in selectOptionsQuery.data
      ).map((item) => ({
        ...item,
        options: selectOptionsQuery.data[item.key],
      }));
      setSelectItems(selectItems);
    }
  }, [selectOptionsQuery.isSuccess, selectOptionsQuery.data]);

  useEffect(() => {
    if (!selectOptionsQuery.data) return;

    const selectedOptions = [...searchParams.entries()]
      .filter(([key]) => key in selectOptionsQuery.data)
      .map(([key, value]) => ({
        selectItemKey: key,
        label:
          selectOptionsQuery.data[key].find((option) => option.value === value)
            ?.label || '',
        value,
      }));

    const selectedOptionMapByKey = selectedOptions.reduce<
      Record<string, SelectedOption[]>
    >((obj, item) => {
      if (item.selectItemKey in obj) {
        obj[item.selectItemKey].push(item);
      } else {
        obj[item.selectItemKey] = [item];
      }
      return obj;
    }, {});

    setSelectedOptions(
      SELECT_ITEMS?.filter(
        (item) => item.key in selectedOptionMapByKey
      ).flatMap((item) => selectedOptionMapByKey[item.key]) || []
    );
  }, [searchParams, selectOptionsQuery.data]);

  const addSelectedOptionBySelectItemKey = useCallback(
    (selectItemKey: string, selectedOptionValue: string) => {
      setSearchParams((searchParams) => {
        const values = searchParams.getAll(selectItemKey);
        if (!values.includes(selectedOptionValue)) {
          searchParams.append(selectItemKey, selectedOptionValue);
        }
        return searchParams;
      });

      // setSelectItems((selectItems) => {
      //   const options =
      //     selectItems?.find((item) => item.key === selectItemKey)?.options ||
      //     [];

      //   const index = options.findIndex(
      //     (option) => option.value === selectedOptionValue
      //   );

      //   if (index > -1) {
      //     options.splice(index, 1);
      //   }

      //   return [...(selectItems || [])];
      // });
    },
    [setSearchParams]
  );

  const removeSelectedOptionBySelectItemKey = useCallback(
    (selectItemKey: string, selectedOptionValue: string) => {
      setSearchParams((searchParams) => {
        const values = searchParams.getAll(selectItemKey);
        if (values.includes(selectedOptionValue)) {
          removeSingleValueForSearchParams(
            searchParams,
            selectItemKey,
            selectedOptionValue
          );
        }
        return searchParams;
      });
    },
    [setSearchParams]
  );

  const dataQuery = useQuery(
    ['data', fetchDataOptions],
    () => fetchData(fetchDataOptions),
    { keepPreviousData: true }
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columns: ColumnDef<Artwork, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked:
              Object.keys(rowSelection).length === dataQuery.data?.totalCount,
            indeterminate: Object.keys(rowSelection).length > 0,
            onChange: () =>
              handleAllRowSelectionChange(table.getRowModel().rows),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.original.id in rowSelection,
              indeterminate: false,
              onChange: () => handleRowSelectionChange(row),
            }}
          />
        </div>
      ),
    },
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Artist',
      accessorKey: 'artist',
    },
    {
      header: 'Image',
      accessorKey: 'image',
      cell: ({ cell }) => (
        <img src={cell.getValue()} alt="Artwork" width={50} loading="lazy" />
      ),
    },
    {
      header: 'Medium',
      accessorKey: 'medium',
    },
    {
      header: 'Size',
      accessorKey: 'size',
    },
    {
      header: 'Year',
      accessorKey: 'year',
    },
    {
      header: 'Other Info',
      accessorKey: 'otherInfo',
    },
    {
      header: 'Inventory Status',
      accessorKey: 'inventoryStatus',
    },
    {
      header: 'Sales Status',
      accessorKey: 'salesStatus',
    },
    {
      header: 'Asset Category',
      accessorKey: 'assetCategory',
    },
  ];

  const table = useReactTable({
    data: dataQuery.data?.rows ?? [],
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const paginationRange = usePagination({
    currentPage: pageIndex,
    totalCount: dataQuery.data?.totalCount ?? 0,
    siblingCount: 1,
    pageSize: pageSize,
  });

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl mt-2">
      <div className="md:w-1/2 mb-3">
        <SearchInput />
      </div>

      <div className="flex gap-2 flex-col md:flex-row">
        <div className="flex-grow flex flex-col gap-3">
          <div className="flex items-center flex-col md:flex-row">
            <label className="text-lg break-keep">篩選條件：</label>
            <div className="flex-grow flex flex-wrap gap-2">
              {selectItems?.map((item) => (
                <MyCombobox
                  key={item.key}
                  placeholder={item.placeholder}
                  options={item.options}
                  onSelectionChange={(option) =>
                    addSelectedOptionBySelectItemKey(item.key, option.value)
                  }
                ></MyCombobox>
              ))}
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row">
            <label className="text-lg break-keep">已選條件：</label>
            <div className="flex-grow flex flex-wrap gap-2">
              {selectedOptions.map((option, i) => (
                <span
                  key={`selectedOption_${i}`}
                  className="btn btn-outline btn-info pr-0 min-w-[6rem] justify-between"
                >
                  {option.label}
                  <XMarkIcon
                    className="w-5 h-5 mx-2"
                    id={i.toString()}
                    onClick={() =>
                      removeSelectedOptionBySelectItemKey(
                        option.selectItemKey,
                        option.value
                      )
                    }
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between">
          <div className="flex md:flex-col gap-2">
            <button
              aria-label="export excel file"
              className="btn btn-accent flex-1"
            >
              Excel 匯出
            </button>
            <button
              aria-label="export pdf file"
              className="btn btn-accent flex-1"
            >
              表格匯出
            </button>
          </div>
          <i className="flex-grow"></i>
          <select
            className="select select-bordered"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider mt-2"></div>

      <div className="h-full w-full pb-6 bg-base-100 text-center">
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <td key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
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
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => table.setPageIndex(pageIndex - 5)}
            disabled={!table.getCanNextPage()}
          >
            {'<<'}
          </button>
          <button
            className="btn"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>

          {paginationRange?.map((pageNumber, key) => {
            if (pageNumber === DOTS) {
              return (
                <button key={key} className="btn btn-disabled">
                  {DOTS}
                </button>
              );
            }

            return (
              <button
                key={key}
                className={classnames('btn', {
                  'btn-active': Number(pageNumber) - 1 === pageIndex,
                })}
                onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            className="btn"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="btn"
            onClick={() => table.setPageIndex(pageIndex + 5)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>

          {/* <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {dataQuery.isFetching ? 'Loading...' : null} */}
        </div>
      </div>
    </div>
  );
}

export default ArtworksList;
