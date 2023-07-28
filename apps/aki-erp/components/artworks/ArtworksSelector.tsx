'use client';

import { useEffect } from 'react';

import IndeterminateCheckbox from '@components/shared/field/IndeterminateCheckbox';
import SearchInput from '@components/shared/field/SearchField';
import {
  assetsTypeOptions,
  salesTypeOptions,
  storeTypeOptionMap,
} from '@constants/artwork.constant';
import { CheckIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import { inputColumn, selectColumn, useArtworkTable } from '@utils/hooks/useArtworkTable';
import useSelectionList from '@utils/hooks/useSelectionList';
import classnames from 'classnames';
import { ArtworkDetail } from 'data-access/models';
import Link from 'next/link';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { showConfirm, showSuccess } from 'utils/swalUtil';

const ArtworksSelector = ({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: (selectedRows?: ArtworkDetail[]) => void;
}) => {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      return;
    }
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      mainElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const { getSearchInputProps, selectItems, selectedOptions, onSelectionChange } =
    useArtworkSearches();

  const { selectionBlock, selectedBlock } = useArtworkSelectedList({
    selectItems,
    selectedOptions,
    onSelectionChange,
  });

  const { getSelectAllProps, getSelectItemProps, selectedRowCount, selectedRows, clearSelection } =
    useSelectionList<ArtworkDetail>();

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
          target="_blank"
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
    status: 'Enabled',
    columns,
    selectItems,
  });

  const addPurchaseOrder = async () => {
    const { isConfirmed } = await showConfirm({
      title: `是否將這 ${selectedRowCount} 筆藝術品新增至進貨單？`,
      icon: 'question',
      html: `
      <ul class="list-disc"> ${selectedRows
        .map(
          (row) =>
            `<li><a class="text-info" href="/app/artworks/${row.displayId}" target="_blank" rel="noopener noreferrer" >${row.displayId}</a></li>`
        )
        .join('')} </ul>
      `,
    });

    if (!isConfirmed) {
      return;
    }

    await showSuccess('已成功新增藝術品至進貨單！');
    onClose?.(selectedRows);
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
          <span className="text-xl">已選擇 {selectedRowCount} 筆</span>
        </h3>

        <div className="my-3 mr-2 px-4 py-2 overflow-y-auto">
          <div className="md:w-1/2 mb-3">
            <SearchInput {...getSearchInputProps()} />
          </div>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex-grow flex flex-col gap-3">
              {selectionBlock}
              {selectedBlock}
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
            {tableBlock}

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
};

export default ArtworksSelector;
