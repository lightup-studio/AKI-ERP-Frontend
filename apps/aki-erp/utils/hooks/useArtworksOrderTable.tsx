'use client';

import { useState } from 'react';

import { ArtworksOrderAddBtn } from '@components/artworks';
import { assetsTypeOptionMap, salesTypeOptionMap } from '@constants/artwork.constant';
import { createOrUpdateArtworkDetail } from '@data-access/apis';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useMutation } from '@tanstack/react-query';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useTable } from '@utils/hooks';
import { showSizeText } from '@utils/showSizeText';
import { showStoreTypeText } from '@utils/showStoreTypeText';
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
  const [selectedArtworks, setSelectedArtworks] = useState<ArtworkDetail[]>([]);

  const mutation = useMutation({
    mutationFn: (data: ArtworkDetail) => createOrUpdateArtworkDetail(data),
  });

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      header: '編號',
      accessorKey: 'displayId',
      cell: ({ row }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/artworks/${row.original.displayId}`}
        >
          {row.original.displayId}
          <PencilSquareIcon className="ml-2 inline-block h-4 w-4"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '作品名稱',
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.zhName || row.original.enName}</div>
      ),
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
                  className="h-full w-full object-contain"
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
        (cell.getValue()?.media || cell.getValue()?.zhMedia) ?? '無',
    },
    {
      id: 'size',
      header: '尺寸',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const { length, width, height } = cell.getValue<ArtworkDetail['metadata']>() || {};
        return showSizeText(length, width, height);
      },
    },
    {
      id: 'year',
      header: '年代',
      accessorKey: 'yearAge',
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
      header: '庫存位置',
      accessorKey: 'warehouseId',
      cell: ({ row }) => {
        const data = row.original;
        const [value, setValue] = useState(data.warehouseId);

        return (
          <select
            className="input w-[3rem] appearance-none p-0 text-center text-sm"
            value={value}
            onChange={(e) => {
              data.warehouseId = +e.target.value;
              setValue(+e.target.value);
              mutation.mutate(data);
            }}
          >
            <option value={0}>A</option>
            <option value={1}>B</option>
            <option value={2}>C</option>
            <option value={3}>D1</option>
            <option value={5}>D2</option>
            <option value={4}>E</option>
          </select>
        );
      },
    },
    {
      id: 'storeType',
      header: '庫存狀態',
      accessorKey: 'metadata',
      cell: ({ cell }: CellContext<ArtworkDetail, ArtworkDetail['metadata']>) => {
        const storeTypeId = cell.getValue()?.storeType;
        return showStoreTypeText(storeTypeId);
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
        const assetsType = cell.getValue()?.assetsType;
        const assetsTypeId = assetsType ? assetsType : 'A';
        return assetsTypeOptionMap[assetsTypeId].label;
      },
    },
  ];

  const { tableBlock, rowSelection, selectedRowsCount, clearRowSelection, ...props } = useTable({
    data: [...artworks, ...selectedArtworks],
    totalCount: artworks.length + selectedArtworks.length,
    columns,
    isLoading: disabled ? isLoading : false,
  });

  const handleClose = (artworks: ArtworkDetail[]) => {
    setSelectedArtworks((prev) => {
      const data = prev.reduce<{ [key: string]: ArtworkDetail }>((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {});

      const list = artworks.filter((artwork) => !data[artwork.id]);

      return [...prev, ...list];
    });
  };

  const handleDelete = () => {
    setSelectedArtworks((prev) => prev.filter((item, index) => !rowSelection[index]));
    clearRowSelection();
  };

  return {
    ...props,
    tableBlock: (
      <>
        {!disabled && (
          <div className="flex items-center gap-2">
            <span>已選擇 {selectedRowsCount} 筆</span>
            <button
              className="btn btn-error"
              disabled={selectedRowsCount === 0}
              onClick={handleDelete}
            >
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
    rowSelection,
    selectedRowsCount,
    clearRowSelection,
  };
};

export default useArtworksOrderTable;
