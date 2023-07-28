'use client';

import { useMemo } from 'react';

import IndeterminateCheckbox from '@components/shared/field/IndeterminateCheckbox';
import SearchField from '@components/shared/field/SearchField';
import {
  assetsTypeOptions,
  salesTypeOptions,
  storeTypeOptionMap,
} from '@constants/artwork.constant';
import { deleteArtworks, patchArtworks } from '@data-access/apis/artworks.api';
import { ArtworkDetail } from '@data-access/models';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';

import { PencilSquareIcon } from '@heroicons/react/20/solid';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { useMutation } from '@tanstack/react-query';
import { CellContext, ColumnDef } from '@tanstack/react-table';

import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import { inputColumn, selectColumn, useArtworkTable } from '@utils/hooks/useArtworkTable';
import useSelectionList from '@utils/hooks/useSelectionList';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArtworksTitleProps } from './ArtworksTitle';

type ArtworksListProps = Pick<ArtworksTitleProps, 'type'>;

const ArtworksList = ({ type }: ArtworksListProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { getSearchInputProps, selectItems, selectedOptions, onSelectionChange } =
    useArtworkSearches();

  const { selectionBlock, selectedBlock } = useArtworkSelectedList({
    selectItems,
    selectedOptions,
    onSelectionChange,
  });

  const { getSelectAllProps, getSelectItemProps, selectedRowCount, selectedRows, clearSelection } =
    useSelectionList<ArtworkDetail>();

  // temp defined status variable for api break change
  const status = useMemo(
    () => (type === 'inventory' ? 'Enabled' : type === 'draft' ? 'Draft' : 'Disabled'),
    [type]
  );
  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center">
          <IndeterminateCheckbox
            {...getSelectAllProps(table.getRowModel().rows, dataQuery.data?.totalCount || 0)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
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
          href={`${pathname}/${cell.getValue()}?${searchParams.toString()}`}
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
                <img
                  src={cell.getValue()}
                  alt="Artwork"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
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
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) =>
        cell.getValue()?.media ?? '無',
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
        const { frame, frameDimensions, pedestal, pedestalDimensions, cardboardBox, woodenBox } =
          cell.getValue()?.otherInfo || {};
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

  const { dataQuery, table, tableBlock } = useArtworkTable({
    status,
    columns,
    selectItems,
  });

  const deleteMutation = useMutation({
    mutationKey: ['deleteArtworks'],
    mutationFn: deleteArtworks,
    onSuccess: () => {
      clearSelection();
      dataQuery.refetch();
    },
  });

  const enableMutation = useMutation({
    mutationKey: ['enableArtwork'],
    mutationFn: (ids: number[]) =>
      patchArtworks(ids, { status: 'Enabled', metadata: { storeType: 'inStock' } }),
    onSuccess: () => {
      clearSelection();
      dataQuery.refetch();
    },
  });

  const handleDelete = () => {
    if (deleteMutation.isLoading || selectedRowCount === 0) return;
    const deletedIds = selectedRows.map((artwork) => artwork.id);
    deleteMutation.mutate(deletedIds);
  };

  const handleEnable = () => {
    if (enableMutation.isLoading || selectedRowCount === 0) return;
    const enabledIds = selectedRows.map((artwork) => artwork.id);
    enableMutation.mutate(enabledIds);
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl">
      <div className="md:w-1/2 mb-3">
        <SearchField {...getSearchInputProps()} />
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
        <button className="btn btn-error" onClick={handleDelete} disabled={selectedRowCount === 0}>
          <TrashIcon className="h-5 w-5"></TrashIcon>
          刪除
        </button>
        {status === 'Draft' && (
          <button
            className="btn btn-accent"
            onClick={handleEnable}
            disabled={selectedRowCount === 0}
          >
            加入庫存
          </button>
        )}
        <i className="flex-grow"></i>
        <Link className="btn btn-info" href={`${pathname}/add?${searchParams.toString()}`}>
          <PlusIcon className="h-5 w-5"></PlusIcon>
          新增
        </Link>
      </div>
      <div className="h-full w-full pb-6 bg-base-100 text-center">{tableBlock}</div>
    </div>
  );
};

export default ArtworksList;
