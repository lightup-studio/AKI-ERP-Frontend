'use client';

import { ArtworksBatchUpdateDialog, ArtworksPreviewBtn } from '@components/artworks';
import { SearchField } from '@components/shared/field';
import { StoreType } from '@constants/artwork.constant';
import { deleteSalesOrderId, fetchSalesOrder, patchArtworksBatchId } from '@data-access/apis';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { formatDateTime } from '@utils/format';
import { useTable } from '@utils/hooks';
import { useArtworkSearches, useArtworkSelectedList } from '@utils/hooks/useArtworkSearches';
import { showConfirm } from '@utils/swalUtil';
import { SalesOrder, Status } from 'data-access/models';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const ShipmentOrders = () => {
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

  const columns: ColumnDef<SalesOrder, any>[] = [
    {
      header: '編號',
      cell: ({ row }) => (
        <Link
          className="text-info flex items-center whitespace-nowrap"
          href={`/shipment/orders/${row.original.id}?${searchParams.toString()}`}
        >
          {row.original.displayId}
          <PencilSquareIcon className="ml-2 inline-block h-4 w-4"></PencilSquareIcon>
        </Link>
      ),
    },
    {
      header: '出貨單位',
      accessorKey: 'shippingDepartment',
    },
    {
      header: '出貨日期',
      cell: ({ row }) => formatDateTime(row.original.shippingTime),
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
      accessorKey: 'receiverInformation.name',
    },
    {
      header: '收件人電話',
      accessorKey: 'receiverInformation.phone',
    },
    {
      header: '地址',
      accessorKey: 'receiverInformation.address',
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
    queryKey: ['SalesOrder', params.toString()],
    queryFn: () => fetchSalesOrder(Status.Enabled, params.toString()),
    enabled: !!selectItems,
    keepPreviousData: true,
  });

  const { table, tableBlock, selectedRows, selectedRowsCount, clearRowSelection } =
    useTable<SalesOrder>({
      data: data?.data,
      totalCount: data?.totalCount,
      columns: columns,
      isLoading: isFetching,
    });

  const deleteMutation = useMutation(
    (ShipmentOrders: SalesOrder[]) => {
      const artworkIds = ShipmentOrders.flatMap((item) => item.artworks?.map((item) => item.id));
      return Promise.all([
        ...ShipmentOrders.map((item) => deleteSalesOrderId(item.id)),
        patchArtworksBatchId({
          idList: artworkIds.filter((item) => typeof item === 'number') as number[],
          properties: {
            status: Status.Disabled,
            metadata: {
              storeType: StoreType.NONE,
              shippingDepartment: undefined,
              returnedShippingDepartment: undefined,
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
      title: '確定刪除出貨單嗎？',
      icon: 'warning',
    });

    if (!isConfirmed) return;
    deleteMutation.mutate(selectedRows);
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
              <button aria-label="export excel file" className="btn btn-accent flex-1 truncate">
                PDF 匯出
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
            新增出貨單
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

export default ShipmentOrders;
