'use client';

import { useMemo, useState } from 'react';

import { ArtworksOrderAddBtn } from '@components/artworks';
import { IndeterminateCheckbox } from '@components/shared/field';
import {
  assetsTypeOptionMap,
  salesTypeOptionMap,
  storeTypeOptionMap,
} from '@constants/artwork.constant';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { CellContext, ColumnDef, Row } from '@tanstack/react-table';
import { useTable } from '@utils/hooks';
import { ArtworkDetail } from 'data-access/models';
import Link from 'next/link';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';

interface useArtworksOrderTableProps {
  artworks?: ArtworkDetail[];
  disabled?: boolean;
  isLoading?: boolean;
}

const useArtworksOrderTable = ({
  artworks = [],
  disabled,
  isLoading,
}: useArtworksOrderTableProps) => {
  const [rowSelection, setRowSelection] = useState<Record<ArtworkDetail['id'], ArtworkDetail>>({});
  const [selectedArtworks, setSelectedArtworks] = useState<ArtworkDetail[]>([]);

  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleClose = (artworks: ArtworkDetail[]) => {
    setSelectedArtworks(artworks);
  };

  const handleRowSelectChange = (row: Row<ArtworkDetail>) => {
    const { id } = row.original;

    id in rowSelection ? delete rowSelection[id] : (rowSelection[id] = row.original);

    setRowSelection(structuredClone(rowSelection));
  };

  const handleAllRowSelectChange = (rows: Row<ArtworkDetail>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    isAnyRowSelected
      ? selectedRows.forEach((row) => delete rowSelection[row.original.id])
      : rows.forEach((row) => (rowSelection[row.original.id] = row.original));

    setRowSelection(structuredClone(rowSelection));
  };

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center">
          {!disabled && (
            <IndeterminateCheckbox
              {...{
                checked: selectedRowCount > 0 && selectedRowCount > artworks.length,
                indeterminate: selectedRowCount > 0,
                onChange: () => handleAllRowSelectChange(table.getRowModel().rows),
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
                checked: row.original.id in rowSelection,
                indeterminate: false,
                onChange: () => handleRowSelectChange(row),
              }}
            />
          )}
        </div>
      ),
    },
    {
      header: '編號',
      accessorKey: 'displayId',
      cell: ({ cell }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/artworks/${cell.getValue()}`}
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
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const salesTypeId = cell.getValue()?.salesType ?? 'unsold';
        return salesTypeOptionMap[salesTypeId].label;
      },
    },
    {
      id: 'assetsType',
      header: '資產類型',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const assetsTypeId = cell.getValue()?.assetsType ?? 'A';
        return assetsTypeOptionMap[assetsTypeId].label;
      },
    },
  ];

  const tableData = {
    data: disabled ? artworks : selectedArtworks,
    totalCount: disabled ? artworks.length : selectedArtworks.length,
  };

  const { table, tableBlock } = useTable({
    data: tableData,
    columns,
    isLoading: disabled ? isLoading : false,
  });

  return {
    rowSelection,
    table,
    tableBlock: (
      <>
        {!disabled && (
          <div className="flex items-center gap-2 py-2 mb-2">
            <span>已選擇 {selectedRowCount} 筆</span>
            <button className="btn btn-error" disabled={selectedRowCount === 0}>
              <TrashIcon className="h-5 w-5"></TrashIcon>
              刪除
            </button>

            <i className="flex-grow"></i>

            <ArtworksOrderAddBtn onClose={handleClose} />
          </div>
        )}

        {tableBlock}
      </>
    ),
  };
};

export default useArtworksOrderTable;
