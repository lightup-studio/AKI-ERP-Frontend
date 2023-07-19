/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';

import { ArtworkDetail } from 'data-access/models';
import { useArtworkSearches, useArtworkSelectedList } from 'features/artworks/ui/useArtworkSearches';
import { useArtworkTable } from 'features/artworks/ui/useArtworkTable';
import { useSelectionList } from 'features/artworks/ui/useSelectionList';
import { setPageTitle } from 'features/common/headerSlice';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import IndeterminateCheckbox from 'shared/ui/IndeterminateCheckbox';
import SearchInput from 'shared/ui/SearchInput';
import { assetsTypeOptionMap, salesTypeOptionMap, storeTypeOptionMap } from 'src/constants/artwork.constant';

import { PencilSquareIcon } from '@heroicons/react/20/solid';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { CellContext, ColumnDef } from '@tanstack/react-table';

import BatchUpdateStoreInfoDialog from './ui/BatchUpdateStoreInfoDialog';

function PurchaseReturnOrders() {
  const [isOpenBatchUpdateStoreInfoDialog, setIsOpenBatchUpdateStoreInfoDialog] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: '進銷存 / 進貨退還單' }));
  }, [dispatch]);

  const [searchParams, setSearchParams] = useSearchParams();

  const { getSearchInputProps, selectItems, selectedOptions, onSelectionChange } = useArtworkSearches({
    searchParams,
    setSearchParams,
  });

  const { selectionBlock, selectedBlock } = useArtworkSelectedList({
    selectItems,
    selectedOptions,
    onSelectionChange,
  });

  const { getSelectAllProps, getSelectItemProps, selectedRowCount, selectedRows } = useSelectionList<ArtworkDetail>();

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
      cell: ({ getValue }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const salesTypeId = getValue()?.salesType ?? 'unsold';
        return salesTypeOptionMap[salesTypeId].label;
      },
    },
    {
      id: 'assetsType',
      header: '資產類型',
      accessorKey: 'metadata',
      cell: ({ getValue }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const assetsTypeId = getValue()?.assetsType ?? 'A';
        return assetsTypeOptionMap[assetsTypeId].label;
      },
    },
  ];

  const { dataQuery, table, tableBlock } = useArtworkTable({
    status: 'Enabled',
    columns,
    selectItems,
    searchParams,
    setSearchParams,
  });

  const handleBatchUpdate = () => {
    setIsOpenBatchUpdateStoreInfoDialog(true);
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl">
        <div className="md:w-1/2 mb-3">
          <SearchInput {...getSearchInputProps()} />
        </div>

        <div className="flex gap-2 flex-col md:flex-row">
          <div className="flex-grow flex flex-col gap-3">
            {selectionBlock}
            {selectedBlock}
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
          <button className="btn btn-success" disabled={selectedRowCount === 0} onClick={handleBatchUpdate}>
            <PencilIcon className="h-5 w-5"></PencilIcon>
            編輯
          </button>
          <button className="btn btn-error" disabled={selectedRowCount === 0}>
            <TrashIcon className="h-5 w-5"></TrashIcon>
            刪除
          </button>
          <i className="flex-grow"></i>
          <Link className="btn btn-info" to={'./add' + (searchParams.toString() && '?' + searchParams.toString())}>
            <PlusIcon className="h-5 w-5"></PlusIcon>
            新增進貨單
          </Link>
        </div>

        <div className="h-full w-full pb-6 bg-base-100 text-center">{tableBlock}</div>
      </div>

      <BatchUpdateStoreInfoDialog
        isOpen={isOpenBatchUpdateStoreInfoDialog}
        data={selectedRows}
        onClose={() => setIsOpenBatchUpdateStoreInfoDialog(false)}
      ></BatchUpdateStoreInfoDialog>
    </>
  );
}

export default PurchaseReturnOrders;
