import React, { useCallback, useEffect, useMemo, useState } from 'react';

import classnames from 'classnames';
import {
  fetchArtworkList,
  fetchSelectOptions,
} from 'data-access/apis/artworks.api';
import { Artwork } from 'data-access/models';
import { setPageTitle } from 'features/common/headerSlice';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { DOTS, usePagination } from 'shared/hooks/usePagination';
import IndeterminateCheckbox from 'shared/ui/IndeterminateCheckbox';
import MyCombobox, { Option as ComboboxOption } from 'shared/ui/MyCombobox';
import SearchInput from 'shared/ui/SearchInput';
import { removeSingleValueForSearchParams } from 'utils/searchParamsUtil';
import { showConfirm, showSuccess } from 'utils/swalUtil';

import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  Row,
  useReactTable,
} from '@tanstack/react-table';

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

function ArtworksSelector({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose?: (...args: any[]) => void;
}) {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      return;
    }
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState<string | undefined>();

  useEffect(() => {
    dispatch(
      setPageTitle({
        title: (
          <>
            進銷存 /{' '}
            <Link
              to={
                '../orders' + searchParams.toString() &&
                '?' + searchParams.toString()
              }
            >
              進貨單
            </Link>{' '}
            / 新增
          </>
        ),
      })
    );
  }, [dispatch, searchParams]);

  useEffect(() => {
    setSearchParams(
      (searchParams) => {
        keyword
          ? searchParams.set('keyword', keyword)
          : searchParams.delete('keyword');
        return searchParams;
      },
      {
        replace: true,
      }
    );
  }, [keyword, setSearchParams]);

  const handleSearch = useCallback(
    (keyword?: string) => {
      setKeyword(keyword);
    },
    [setKeyword]
  );

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

    setSelectItems((selectItems) => {
      selectItems?.forEach((selectItem) => {
        const selectedOptionValues = selectedOptionMapByKey[
          selectItem.key
        ]?.map((option) => option.value);

        selectItem.options = selectOptionsQuery.data[selectItem.key].filter(
          (option) => !selectedOptionValues?.includes(option.value)
        );
      });
      return [...(selectItems || [])];
    });

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

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 50,
    });
  const pagination = useMemo(
    () => ({ pageIndex, pageSize }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    setSearchParams(
      (searchParams) => {
        pageIndex > 0
          ? searchParams.set('pageIndex', `${pageIndex}`)
          : searchParams.delete('pageIndex');
        pageSize !== 50
          ? searchParams.set('pageSize', `${pageSize}`)
          : searchParams.delete('pageSize');
        return searchParams;
      },
      {
        replace: true,
      }
    );
  }, [pageIndex, pageSize, setSearchParams]);

  const dataQuery = useQuery(
    ['data', keyword, selectItems, pagination],
    () => fetchArtworkList(searchParams),
    { keepPreviousData: true }
  );

  const [rowSelection, setRowSelection] = React.useState<
    Record<Artwork['id'], Artwork>
  >({});

  const selectedRowCount = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection]
  );

  const handleAllRowSelectionChange = (rows: Row<Artwork>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
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

  const columns: ColumnDef<Artwork, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: selectedRowCount === dataQuery.data?.totalCount,
            indeterminate: selectedRowCount > 0,
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
      cell: ({ cell }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          to={
            cell.getValue() +
            (searchParams.toString() && '?' + searchParams.toString())
          }
        >
          {cell.getValue()}
          <PencilSquareIcon className="h-4 w-4 ml-2 inline-block"></PencilSquareIcon>
        </Link>
      ),
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

  const addPurchaseOrder = async () => {
    const { isConfirmed } = await showConfirm({
      title: `是否將這 ${selectedRowCount} 筆藝術品新增至進貨單？`,
      icon: 'question',
      html: `
      <ul class="list-disc"> ${Object.keys(rowSelection)
        .map(
          (key) =>
            `<li><a class="text-info" href="/app/artworks/${rowSelection[key].id}" target="_blank" rel="noopener noreferrer" >${rowSelection[key].id}</a></li>`
        )
        .join('')} </ul>
      `,
    });

    if (!isConfirmed) {
      return;
    }

    showSuccess('已成功新增藝術品至進貨單！').then(() =>
      onClose?.(rowSelection)
    );
  };

  return (
    <div
      className={classnames('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <div className="modal-box max-w-none overflow-hidden flex flex-col p-0">
        <h3 className="font-bold m-4 pb-2 mb-0 text-2xl border-b-base-content border-b flex justify-between items-baseline">
          新增藝術品
          <span className="text-xl">已勾選 {selectedRowCount} 筆</span>
        </h3>

        <div className="my-3 mr-2 px-4 py-2 overflow-y-auto">
          <div className="md:w-1/2 mb-3">
            <SearchInput onSearch={handleSearch} />
          </div>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex-grow flex flex-col gap-3">
              <div className="flex items-center flex-col md:flex-row min-h-[6rem]">
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

              <div className="flex items-center flex-col md:flex-row min-h-12">
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
              <i className="flex-grow"></i>
              <select
                className="select select-bordered"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 30, 50, 80, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} 筆
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divider mt-2 mb-0"></div>

          <div className="h-full w-full bg-base-100 text-center">
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
            <div className="join">
              <button
                className="join-item btn"
                onClick={() => table.setPageIndex(pageIndex - 5)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </button>
              <button
                className="join-item btn"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {'<'}
              </button>

              <button className="join-item btn btn-active block md:hidden">
                第 {pageIndex + 1} 頁
              </button>

              {paginationRange?.map((pageNumber, key) => {
                if (pageNumber === DOTS) {
                  return (
                    <button
                      key={key}
                      className="join-item btn btn-disabled hidden md:block"
                    >
                      {DOTS}
                    </button>
                  );
                }

                return (
                  <button
                    key={key}
                    className={classnames(
                      'join-item btn w-14 hidden md:block',
                      {
                        'btn-active': Number(pageNumber) - 1 === pageIndex,
                      }
                    )}
                    onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className="join-item btn"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {'>'}
              </button>
              <button
                className="join-item btn"
                onClick={() => table.setPageIndex(pageIndex + 5)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </button>
            </div>

            <div className="bg-base-100 mt-4 md:col-span-2 flex gap-2 justify-center">
              <button
                className="btn btn-success"
                onClick={addPurchaseOrder}
                disabled={selectedRowCount === 0}
              >
                <CheckIcon className="w-4"></CheckIcon> 儲存
              </button>
              <button
                className="btn btn-error btn-base-200"
                type="button"
                onClick={() => onClose?.()}
              >
                <XMarkIcon className="w-4"></XMarkIcon> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
      <label className="modal-backdrop" onClick={() => onClose?.()}>
        Close
      </label>
    </div>
  );
}

export default ArtworksSelector;
