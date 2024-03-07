'use client';

import { useState } from 'react';

import cx from 'classnames';
import { LendReturnOrder, Status } from 'data-access/models';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { ArtworksBatchUpdateDialog, ArtworksPreviewBtn } from '@components/artworks';
import { SearchField } from '@components/shared/field';
import { StoreType } from '@constants/artwork.constant';
import {
  deleteLendReturnOrderId,
  exportLendReturnOrdersByIds,
  fetchLendReturnOrder,
  patchArtworksBatchId,
} from '@data-access/apis';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@utils/format';
import { useTable } from '@utils/hooks';
import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import { showConfirm, showWarning } from '@utils/swalUtil';

const LendReturnOrders = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { getSearchInputProps, selectItems, selectedOptions, onSelectionChange } =
    useArtworkSearches();

  const { selectionBlock, selectedBlock } = useArtworkSelectedList({
    selectItems,
    selectedOptions,
    onSelectionChange,
  });

  const columns: ColumnDef<LendReturnOrder, any>[] = [
    {
      header: '編號',
      cell: ({ row }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/lend/return-orders/${row.original.id}?${searchParams.toString()}`}
        >
          {row.original.displayId}
          <PencilSquareIcon className="ml-2 inline-block h-4 w-4"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '借展單位',
      accessorKey: 'lendDepartment',
    },
    {
      header: '借展日期',
      cell: ({ row }) => formatDateTime(row.original.lendReturnTime),
    },
    {
      header: '聯絡人',
      accessorKey: 'contactPersonInformation.name',
    },
    {
      header: '聯絡人電話',
      accessorKey: 'contactPersonInformation.phone',
    },
    {
      header: '收件人',
      accessorKey: 'returnerInformation.name',
    },
    {
      header: '收件人電話',
      accessorKey: 'returnerInformation.phone',
    },
    {
      header: '地址',
      accessorKey: 'returnerInformation.address',
    },
    {
      header: '備註',
      accessorKey: 'memo',
    },
    {
      header: '功能',
      cell: ({ row }) => <ArtworksPreviewBtn artworks={row.original.artworks} />,
    },
  ];

  const params = new URLSearchParams(searchParams);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['LendReturnOrder', params.toString()],
    queryFn: () => fetchLendReturnOrder(Status.Enabled, params.toString()),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  const { table, tableBlock, selectedRows, selectedRowsCount, clearRowSelection } =
    useTable<LendReturnOrder>({
      data: data?.data,
      totalCount: data?.totalCount,
      columns: columns,
      isLoading: isFetching,
    });

  const deleteMutation = useMutation(
    (LendReturnOrders: LendReturnOrder[]) => {
      const artworkIds = LendReturnOrders.flatMap((item) => item.artworks?.map((item) => item.id));
      return Promise.all([
        ...LendReturnOrders.map((item) => deleteLendReturnOrderId(item.id)),
        patchArtworksBatchId({
          idList: artworkIds.filter((item) => typeof item === 'number') as number[],
          properties: {
            status: Status.Disabled,
            metadata: {
              storeType: StoreType.NONE,
              lendDepartment: undefined,
            },
          },
        }),
      ]);
    },
    {
      onSuccess: () => {
        clearRowSelection();
        refetch();
      },
    },
  );

  const handleDelete = async () => {
    const { isConfirmed } = await showConfirm({
      title: '確定刪除借出歸還單嗎？',
      icon: 'warning',
    });

    if (!isConfirmed) return;
    deleteMutation.mutate(selectedRows);
  };

  const exportOrdersMutation = useMutation({
    mutationKey: ['exportLendReturnOrders'],
    mutationFn: exportLendReturnOrdersByIds,
  });

  const onExportOrders = async () => {
    if (selectedRowsCount === 0) {
      showWarning('請至少選擇1筆借出歸還單！');
      return;
    }

    const { downloadPageUrl } = await exportOrdersMutation.mutateAsync(
      selectedRows.map((item) => item.id),
    );

    if (!downloadPageUrl) return;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', downloadPageUrl);
    linkElement.setAttribute('target', '_blank');
    linkElement.click();
    linkElement.remove();
  };

  return (
    <>
      <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
        <div className="mb-3 md:w-1/2">
          <SearchField {...getSearchInputProps()} />
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-grow flex-col gap-3">
            {selectionBlock}
            {selectedBlock}
          </div>

          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2 md:flex-col">
              <button
                aria-label="export pdf file"
                className={cx('btn btn-accent flex-1', {
                  'flex-nowrap whitespace-nowrap': exportOrdersMutation.isLoading,
                })}
                onClick={onExportOrders}
                disabled={exportOrdersMutation.isLoading}
              >
                {exportOrdersMutation.isLoading ? (
                  <>
                    處理中 <span className="loading loading-ring loading-sm"></span>
                  </>
                ) : (
                  <>表格匯出</>
                )}
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

        <div className="divider my-2"></div>

        <div className="flex items-center gap-2">
          <span>已選擇 {selectedRowsCount} 筆</span>
          <button
            className="btn btn-success"
            disabled={selectedRowsCount === 0}
            onClick={() => setIsOpen(true)}
          >
            <PencilIcon className="h-5 w-5"></PencilIcon>
            編輯
          </button>
          <button
            className="btn btn-error"
            disabled={selectedRowsCount === 0}
            onClick={handleDelete}
          >
            <TrashIcon className="h-5 w-5"></TrashIcon>
            刪除
          </button>
          <i className="flex-grow"></i>
          <Link className="btn btn-info" href={`${pathname}/add?${searchParams.toString()}`}>
            <PlusIcon className="h-5 w-5"></PlusIcon>
            新增借出歸還單
          </Link>
        </div>

        <div className="bg-base-100 h-full w-full pb-6 text-center">{tableBlock}</div>
      </div>

      <ArtworksBatchUpdateDialog
        list={selectedRows}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      ></ArtworksBatchUpdateDialog>
    </>
  );
};

export default LendReturnOrders;
