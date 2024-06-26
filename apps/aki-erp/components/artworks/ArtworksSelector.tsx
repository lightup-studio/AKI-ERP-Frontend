'use client';

import { useEffect } from 'react';

import SearchInput from '@components/shared/field/SearchField';
import { assetsTypeOptions, salesTypeOptions } from '@constants/artwork.constant';
import { PAGE_SIZES } from '@constants/page.constant';
import { CheckIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import useArtworksTable, { selectColumn } from '@utils/hooks/useArtworksTable';
import { showSizeText } from '@utils/showSizeText';
import { showStoreTypeText } from '@utils/showStoreTypeText';
import cx from 'classnames';
import { ArtworkDetail, Status } from 'data-access/models';
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

  const columns: ColumnDef<ArtworkDetail, any>[] = [
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

  const { table, tableBlock, selectedRows, selectedRowsCount } = useArtworksTable({
    status: Status.Enabled,
    columns,
    selectItems,
  });

  const addPurchaseOrder = async () => {
    const { isConfirmed } = await showConfirm({
      title: `是否新增 ${selectedRowsCount} 筆藝術品？`,
      icon: 'question',
      html: `
      <ul class="list-disc"> ${selectedRows
        .map(
          (row) =>
            `<li><a class="text-info" href="/app/artworks/${row.displayId}" target="_blank" rel="noopener noreferrer" >${row.displayId}</a></li>`,
        )
        .join('')} </ul>
      `,
    });

    if (!isConfirmed) {
      return;
    }

    await showSuccess('已成功新增藝術品！');
    onClose?.(selectedRows);
  };

  return (
    <div
      className={cx('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <div className="modal-box absolute top-0 flex max-w-none flex-col overflow-hidden p-0">
        <h3 className="border-b-base-content m-4 mb-0 flex items-baseline justify-between border-b pb-2 text-2xl font-bold">
          新增藝術品
          <span className="text-xl">已選擇 {selectedRowsCount} 筆</span>
        </h3>

        <div className="my-3 mr-2 overflow-y-auto px-4 py-2">
          <div className="mb-3 md:w-1/2">
            <SearchInput {...getSearchInputProps()} />
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex flex-grow flex-col gap-3">
              {selectionBlock}
              {selectedBlock}
            </div>

            <div className="flex flex-col justify-between gap-2">
              <i className="flex-grow"></i>
              <select
                className="select select-bordered"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {PAGE_SIZES.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} 筆
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="bg-base-100 h-full w-full text-center">
            {tableBlock}

            <div className="bg-base-100 mt-4 flex justify-center gap-2 md:col-span-2">
              <button
                className="btn btn-success"
                onClick={addPurchaseOrder}
                disabled={selectedRowsCount === 0}
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
