/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';

import classnames from 'classnames';
import { deleteArtworks, fetchArtworkList2, fetchSelectOptions, patchArtwork } from 'data-access/apis/artworks.api';
import { ArtworkDetail } from 'data-access/models';
import { setPageTitle } from 'features/common/headerSlice';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { DOTS, usePagination } from 'shared/hooks/usePagination';
import IndeterminateCheckbox from 'shared/ui/IndeterminateCheckbox';
import MyCombobox, { Option as ComboboxOption } from 'shared/ui/MyCombobox';
import SearchInput from 'shared/ui/SearchInput';
import { assetsTypeOptions, salesTypeOptions, storeTypeOptionMap } from 'src/constants/artwork.constant';
import { removeSingleValueForSearchParams } from 'utils/searchParamsUtil';

import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, PaginationState, Row, useReactTable } from '@tanstack/react-table';

import ArtworksTitle, { ArtworksTitleProps } from './ui/ArtworksTitle';

type SelectItemKey = keyof Awaited<ReturnType<typeof fetchSelectOptions>>;

type SelectItem = {
  key: SelectItemKey;
  placeholder: string;
  options: ComboboxOption[];
};

type SelectedOption = ComboboxOption & {
  selectItemKey: SelectItemKey;
};

const SELECT_ITEMS: Pick<SelectItem, 'key' | 'placeholder'>[] = [
  { key: 'nationalities', placeholder: '國籍' },
  { key: 'artists', placeholder: '藝術家' },
  { key: 'serialNumbers', placeholder: '號數' },
  { key: 'years', placeholder: '年代' },
  { key: 'storeTypes', placeholder: '庫存狀態' },
  { key: 'salesTypes', placeholder: '銷售狀態' },
  { key: 'assetsTypes', placeholder: '資產類別' },
  { key: 'mediums', placeholder: '媒材' },
  { key: 'agentGalleries', placeholder: '藝廊資訊' },
  { key: 'otherInfos', placeholder: '其他資訊' },
];

// Give our default column cell renderer editing superpowers!
const inputColumn = ({ getValue, row: { index }, column: { id }, table }: CellContext<ArtworkDetail, any>) => {
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
const selectColumn = (
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

type ArtworksListProps = Pick<ArtworksTitleProps, 'type'>;

function ArtworksList({ type }: ArtworksListProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: <ArtworksTitle type={type} /> }));
  }, [dispatch, type]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword'));

  useEffect(() => {
    setSearchParams(
      (searchParams) => {
        keyword ? searchParams.set('keyword', keyword) : searchParams.delete('keyword');
        // reset page index
        searchParams.delete('pageIndex');
        return searchParams;
      },
      {
        replace: true,
      }
    );
  }, [keyword, setSearchParams]);

  const handleSearch = (keyword?: string | null) => {
    setKeyword(keyword || '');
    setPagination(({ pageSize }) => ({ pageIndex: 0, pageSize }));
  };

  const selectOptionsQuery = useQuery({
    queryKey: ['selectOptions'],
    queryFn: fetchSelectOptions,
  });

  const [selectItems, setSelectItems] = useState<SelectItem[]>();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  useEffect(() => {
    if (selectOptionsQuery.isSuccess) {
      const selectItems = SELECT_ITEMS.filter(({ key }) => key in selectOptionsQuery.data).map(
        (item) =>
          ({
            ...item,
            options: selectOptionsQuery.data[item.key],
          } as SelectItem)
      );
      setSelectItems(selectItems);
    }
  }, [selectOptionsQuery.isSuccess, selectOptionsQuery.data]);

  useEffect(() => {
    if (!selectOptionsQuery.data) return;

    const selectedOptions = ([...searchParams.entries()] as [SelectItemKey, string][])
      .filter(([key]) => key in selectOptionsQuery.data)
      .map<SelectedOption>(([key, value]) => ({
        selectItemKey: key,
        label: selectOptionsQuery.data[key].find((x) => x.value === value)?.label || '',
        value,
      }));

    const selectedOptionMapByKey = selectedOptions.reduce((obj, item) => {
      if (item.selectItemKey in obj) {
        obj[item.selectItemKey].push(item);
      } else {
        obj[item.selectItemKey] = [item];
      }
      return obj;
    }, {} as Record<SelectItemKey, SelectedOption[]>);

    setSelectItems((selectItems) => {
      selectItems?.forEach((selectItem) => {
        const selectedOptionValues = selectedOptionMapByKey[selectItem.key]?.map((option) => option.value);

        selectItem.options = selectOptionsQuery.data[selectItem.key].filter((option) => !selectedOptionValues?.includes(option.value));
      });
      return [...(selectItems || [])];
    });

    setSelectedOptions(
      SELECT_ITEMS?.filter((item) => item.key in selectedOptionMapByKey).flatMap((item) => selectedOptionMapByKey[item.key]) || []
    );
  }, [searchParams, selectOptionsQuery.data]);

  const addSelectedOptionBySelectItemKey = (selectItemKey: SelectItemKey, selectedOptionValue: string) => {
    setSearchParams((searchParams) => {
      const values = searchParams.getAll(selectItemKey);
      if (!values.includes(selectedOptionValue)) {
        searchParams.append(selectItemKey, selectedOptionValue);
      }
      // reset page index
      searchParams.delete('pageIndex');
      setPagination(({ pageSize }) => ({ pageIndex: 0, pageSize }));
      return searchParams;
    });
  };

  const removeSelectedOptionBySelectItemKey = (selectItemKey: SelectItemKey, selectedOptionValue: string) => {
    setPagination(({ pageSize }) => ({ pageIndex: 0, pageSize }));
    setSearchParams((searchParams) => {
      const values = searchParams.getAll(selectItemKey);
      if (values.includes(selectedOptionValue)) {
        removeSingleValueForSearchParams(searchParams, selectItemKey, selectedOptionValue);
      }
      // reset page index
      searchParams.delete('pageIndex');
      setPagination(({ pageSize }) => ({ pageIndex: 0, pageSize }));
      return searchParams;
    });
  };

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: +(searchParams.get('pageIndex') || 0),
    pageSize: +(searchParams.get('pageSize') || 50),
  });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => {
    if (pageIndex === +(searchParams.get('pageIndex') || 0) && pageSize === +(searchParams.get('pageSize') || 50)) {
      return;
    }

    setSearchParams(
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

  const dataQuery = useQuery(
    ['data', searchParams.toString()],
    () => fetchArtworkList2(type === 'inventory' ? 'Enabled' : type === 'draft' ? 'Draft' : 'Disabled', searchParams),
    {
      enabled: !!selectItems,
      keepPreviousData: true,
    }
  );

  const [tableData, setTableData] = useState<ArtworkDetail[]>([]);

  useEffect(() => {
    if (dataQuery.isSuccess) {
      const tableData = structuredClone(dataQuery.data.data);
      setTableData(tableData);
    }
  }, [dataQuery.isSuccess, dataQuery.data]);

  const [rowSelection, setRowSelection] = React.useState<Record<ArtworkDetail['id'], ArtworkDetail>>({});

  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleAllRowSelectionChange = (rows: Row<ArtworkDetail>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<ArtworkDetail>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const deleteMutation = useMutation({
    mutationKey: ['deleteArtworks'],
    mutationFn: deleteArtworks,
    onSuccess: () => {
      dataQuery.refetch();
    },
  });

  const onDelete = () => {
    if (selectedRowCount > 0) {
      deleteMutation.mutate(Object.keys(rowSelection));
      setRowSelection({});
    }
  };

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: dataQuery.data?.totalCount !== 0 && selectedRowCount === dataQuery.data?.totalCount,
              indeterminate: selectedRowCount > 0,
              onChange: () => handleAllRowSelectionChange(table.getRowModel().rows),
            }}
          />
        </div>
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
      header: '編號',
      accessorKey: 'displayId',
      cell: ({ cell }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          to={cell.getValue() + (searchParams.toString() && '?' + searchParams.toString())}
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
        if (frame) return '表框' + frameDimensions && `，尺寸 ${frameDimensions}`;
        if (pedestal) return '台座' + pedestalDimensions && `，尺寸 ${pedestalDimensions}`;
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

  const paginationRange = usePagination({
    currentPage: pageIndex,
    totalCount: dataQuery.data?.totalCount ?? 0,
    siblingCount: 1,
    pageSize: pageSize,
  });

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl">
      <div className="md:w-1/2 mb-3">
        <SearchInput value={keyword} onSearch={handleSearch} />
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
                  onSelectionChange={(option) => addSelectedOptionBySelectItemKey(item.key, option.value)}
                ></MyCombobox>
              ))}
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row min-h-12">
            <label className="text-lg break-keep">已選條件：</label>
            <div className="flex-grow flex flex-wrap gap-2">
              {selectedOptions.map((option, i) => (
                <span key={`selectedOption_${i}`} className="btn btn-outline btn-info pr-0 min-w-[6rem] justify-between">
                  {option.label}
                  <XMarkIcon
                    className="w-5 h-5 mx-2"
                    id={i.toString()}
                    onClick={() => removeSelectedOptionBySelectItemKey(option.selectItemKey, option.value)}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 justify-between">
          <div className="flex md:flex-col gap-2">
            <button aria-label="export excel file" className="btn btn-accent flex-1 truncate">
              Excel 匯出
            </button>
            <button aria-label="export pdf file" className="btn btn-accent flex-1">
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
            {[10, 30, 50, 80, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} 筆
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="divider mt-2 mb-0"></div>

      <div className="flex items-center gap-2 py-2 mb-2">
        <span>已選擇 {selectedRowCount} 筆</span>
        <button className="btn btn-error" onClick={onDelete} disabled={selectedRowCount === 0}>
          <TrashIcon className="h-5 w-5"></TrashIcon>
          刪除
        </button>
        <i className="flex-grow"></i>
        <Link className="btn btn-info" to={'./add' + (searchParams.toString() && '?' + searchParams.toString())}>
          <PlusIcon className="h-5 w-5"></PlusIcon>
          新增
        </Link>
      </div>

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
                          'min-w-[10rem]': !['select', 'storeTypeId', 'salesStatusId', 'assetsTypeId'].includes(header.id),
                          'min-w-[3rem]': ['storeTypeId', 'salesStatusId', 'assetsTypeId'].includes(header.id),
                          'text-center': ['mediumKey', 'assetsTypeId'].includes(header.id),
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
        <div className="join">
          <button className="join-item btn" onClick={() => table.setPageIndex(pageIndex - 5)} disabled={!table.getCanPreviousPage()}>
            {'<<'}
          </button>
          <button className="join-item btn" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {'<'}
          </button>

          <button className="join-item btn btn-active block md:hidden">第 {pageIndex + 1} 頁</button>

          {paginationRange?.map((pageNumber, key) => {
            if (pageNumber === DOTS) {
              return (
                <button key={key} className="join-item btn btn-disabled hidden md:block">
                  {DOTS}
                </button>
              );
            }

            return (
              <button
                key={key}
                className={classnames('join-item btn w-14 hidden md:block', {
                  'btn-active': Number(pageNumber) - 1 === pageIndex,
                })}
                onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
              >
                {pageNumber}
              </button>
            );
          })}

          <button className="join-item btn" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>
          <button className="join-item btn" onClick={() => table.setPageIndex(pageIndex + 5)} disabled={!table.getCanNextPage()}>
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtworksList;
