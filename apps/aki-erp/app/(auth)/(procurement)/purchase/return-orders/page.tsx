'use client';

import { useEffect, useState } from 'react';

import { ArtworksBatchUpdateDialog, ArtworksPreviewBtn } from '@components/artworks';
import { SearchField } from '@components/shared/field';
import {
  deletePurchaseReturnOrderId,
  exportPurchaseReturnOrdersByIds,
  fetchPurchaseReturnOrder,
  patchArtworksBatchId,
} from '@data-access/apis';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@utils/format';
import { useTable } from '@utils/hooks';
import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import { PurchaseReturnOrder, Status } from 'data-access/models';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { StoreType } from '@constants/artwork.constant';
import { showConfirm, showWarning } from '@utils/swalUtil';

const PurchaseReturnOrders = () => {
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

  const columns: ColumnDef<PurchaseReturnOrder, any>[] = [
    {
      header: '編號',
      cell: ({ row }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/purchase/return-orders/${row.original.id}?${searchParams.toString()}`}
        >
          {row.original.displayId}
          <PencilSquareIcon className="ml-2 inline-block h-4 w-4"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '進貨退還單位',
      accessorKey: 'returnCompany',
    },
    {
      header: '進貨日期',
      cell: ({ row }) => formatDateTime(row.original.purchaseReturnTime),
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
      header: '功能',
      cell: ({ row }) => <ArtworksPreviewBtn artworks={row.original.artworks} />,
    },
  ];

  const params = new URLSearchParams(searchParams);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['PurchaseReturnOrder', params.toString()],
    queryFn: () => fetchPurchaseReturnOrder(Status.Enabled, params.toString()),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  const { table, tableBlock, selectedRows, selectedRowsCount, clearRowSelection } =
    useTable<PurchaseReturnOrder>({
      data: data?.data,
      totalCount: data?.totalCount,
      columns: columns,
      isLoading: isFetching,
    });

  const deleteMutation = useMutation(
    (purchaseReturnOrders: PurchaseReturnOrder[]) => {
      const artworkIds = purchaseReturnOrders.flatMap(
        (item) => item.artworks?.map((item) => item.id),
      );
      return Promise.all([
        ...purchaseReturnOrders.map((item) => deletePurchaseReturnOrderId(item.id)),
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
      title: '確定刪除進貨歸還單嗎？',
      icon: 'warning',
    });

    if (!isConfirmed) return;
    deleteMutation.mutate(selectedRows);
  };

  const exportOrdersMutation = useMutation({
    mutationKey: ['exportPurchaseReturnOrders'],
    mutationFn: exportPurchaseReturnOrdersByIds,
  });

  const onExportOrders = () => {
    if (selectedRowsCount === 0) {
      showWarning('請至少選擇1筆進貨歸還單！');
      return;
    }
    exportOrdersMutation.mutate(selectedRows.map((item) => item.id));
  };

  useEffect(() => {
    if (!exportOrdersMutation.data) return;
    const { downloadPageUrl } = exportOrdersMutation.data;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', downloadPageUrl);
    linkElement.setAttribute('target', '_blank');
    linkElement.click();
    linkElement.remove();
  }, [exportOrdersMutation.data]);

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
                className="btn btn-accent flex-1 truncate"
                onClick={onExportOrders}
              >
                PDF 匯出
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
            onClick={handleDelete}
            disabled={selectedRowsCount === 0}
          >
            <TrashIcon className="h-5 w-5"></TrashIcon>
            刪除
          </button>
          <i className="flex-grow"></i>
          <Link className="btn btn-info" href={`${pathname}/add?${searchParams.toString()}`}>
            <PlusIcon className="h-5 w-5"></PlusIcon>
            新增進貨退還單
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

export default PurchaseReturnOrders;
