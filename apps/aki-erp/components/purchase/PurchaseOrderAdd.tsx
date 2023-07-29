'use client';

import { useMemo, useState } from 'react';

import cx from 'classnames';
import { ArtworkDetail, CreateOrUpdatePurchaseOrderRequest, Status } from 'data-access/models';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { useForm } from 'react-hook-form';
import { showConfirm, showError, showSuccess } from 'utils/swalUtil';
import * as yup from 'yup';

import { ArtworksSelector } from '@components/artworks';
import MyDatePicker from '@components/shared/MyDatePicker';
import Table from '@components/shared/Table';
import { IndeterminateCheckbox } from '@components/shared/field';
import {
  assetsTypeOptionMap,
  salesTypeOptionMap,
  storeTypeOptionMap,
} from '@constants/artwork.constant';
import { createPurchaseOrder } from '@data-access/apis';
import {
  CheckIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import {
  CellContext,
  ColumnDef,
  PaginationState,
  Row,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import usePagination, { DOTS } from '@utils/hooks/usePagination';

type FormData = {
  salesCompany: string;
  salesInformation: {
    name: string;
    phone: string;
  };
  receiverInformation: {
    name: string;
    phone: string;
    address: string;
  };
};

const schema = yup.object().shape({
  salesCompany: yup.string().required('必填項目'),
  salesInformation: yup.object({
    name: yup.string().required('必填項目'),
    phone: yup.string().required('必填項目'),
  }),
  receiverInformation: yup.object({
    name: yup.string().required('必填項目'),
    phone: yup.string().required('必填項目'),
    address: yup.string().required('必填項目'),
  }),
});

const PurchaseOrderAdd = () => {
  const [isOpenArtworksSelector, setIsOpenArtworksSelector] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  // const dataQuery = useQuery(['data', pagination], () => fetchArtworkList(searchParams), {
  //   keepPreviousData: true,
  // });

  const [artworks, setArtworks] = useState<ArtworkDetail[]>([]);

  const mutation = useMutation({
    mutationFn: (data: CreateOrUpdatePurchaseOrderRequest) => createPurchaseOrder(data),
    onSuccess: async () => {
      await showSuccess('新增成功！');
      router.back();
    },
    onError: async () => {
      await showError('新增失敗！');
    },
  });

  const [rowSelection, setRowSelection] = useState<Record<ArtworkDetail['id'], ArtworkDetail>>({});

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

  const columns: ColumnDef<ArtworkDetail, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center">
          <IndeterminateCheckbox
            {...{
              checked: selectedRowCount > 0 && selectedRowCount > artworks.length,
              indeterminate: selectedRowCount > 0,
              onChange: () => handleAllRowSelectionChange(table.getRowModel().rows),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
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

  const table = useReactTable({
    data: artworks,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const paginationRange = usePagination({
    currentPage: pageIndex,
    totalCount: artworks.length,
    siblingCount: 1,
    pageSize: pageSize,
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver<FormData>(schema),
  });

  const onSubmit = async (formData: FormData) => {
    const { isConfirmed } = await showConfirm({
      title: '確定新增出貨單？',
      icon: 'question',
    });

    if (!isConfirmed) return;
    await mutation.mutateAsync({
      salesCompany: formData.salesCompany,
      purchaseTime: new Date(),
      salesInformation: {
        name: formData.salesInformation.name,
        phone: formData.salesInformation.phone,
      },
      receiverInformation: {
        name: formData.receiverInformation.name,
        phone: formData.receiverInformation.phone,
        address: formData.receiverInformation.address,
      },
      artworkIdList: Object.values(rowSelection).map((row) => row.id),
      status: Status.Enabled,
    });
  };

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="flex-grow flex flex-col gap-3">
            <form className="w-full max-w-lg">
              <div className="flex flex-wrap -mx-3 mb-3">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="font-bold mb-2" htmlFor="grid-first-name">
                    進貨單位
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-first-name"
                    type="text"
                    {...register('salesCompany')}
                  />
                  {errors.salesCompany && (
                    <p className="text-error text-xs italic">{errors.salesCompany.message}</p>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="font-bold mb-2" htmlFor="grid-last-name">
                    進貨日期
                  </label>
                  <MyDatePicker id="grid-last-name" className="border rounded-lg" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-3">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="font-bold mb-2" htmlFor="grid-first-name">
                    聯絡人
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-first-name"
                    type="text"
                    placeholder="Jane"
                    {...register('salesInformation.name')}
                  />
                  {errors.salesInformation?.name && (
                    <p className="text-error text-xs italic">
                      {errors.salesInformation.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="font-bold mb-2" htmlFor="grid-first-name">
                    聯絡人電話
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-first-name"
                    type="text"
                    placeholder="0912345678"
                    {...register('salesInformation.phone')}
                  />
                  {errors.salesInformation?.phone && (
                    <p className="text-error text-xs italic">
                      {errors.salesInformation.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-3">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="font-bold mb-2" htmlFor="grid-first-name">
                    收件人
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-first-name"
                    type="text"
                    placeholder="Jane"
                    {...register('receiverInformation.name')}
                  />
                  {errors.receiverInformation?.name && (
                    <p className="text-error text-xs italic">
                      {errors.receiverInformation.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="font-bold mb-2" htmlFor="grid-first-name">
                    收件人電話
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-first-name"
                    type="text"
                    placeholder="0912345678"
                    {...register('receiverInformation.phone')}
                  />
                  {errors.receiverInformation?.phone && (
                    <p className="text-error text-xs italic">
                      {errors.receiverInformation.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label
                    className="block uppercase tracking-wide font-bold"
                    htmlFor="grid-password"
                  >
                    地址
                  </label>
                  <input
                    className={cx('input input-bordered', {
                      'input-error': errors.salesCompany,
                    })}
                    id="grid-password"
                    {...register('receiverInformation.address')}
                  />
                  {errors.receiverInformation?.address && (
                    <p className="text-error text-xs italic">
                      {errors.receiverInformation.address.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6 justify-center">
            <div className="flex md:flex-col gap-2">
              <button aria-label="export pdf file" className="btn btn-accent flex-1">
                表格匯出
              </button>
            </div>
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
          <button className="btn btn-error" disabled={selectedRowCount === 0}>
            <TrashIcon className="h-5 w-5"></TrashIcon>
            刪除
          </button>
          <i className="flex-grow"></i>
          <button className="btn btn-info" onClick={() => setIsOpenArtworksSelector(true)}>
            <PlusIcon className="h-5 w-5"></PlusIcon>
            新增藝術品
          </button>
        </div>

        <div className="h-full w-full bg-base-100 text-center">
          <Table table={table} />

          <div className="divider mt-2" />

          <div className="join">
            <button
              className="join-item btn"
              onClick={() => table.setPageIndex(pageIndex - 5)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="join-item btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>

            <button className="join-item btn btn-active block md:hidden">
              第 {pageIndex + 1} 頁
            </button>

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
                  className={cx('join-item btn w-14 hidden md:block', {
                    'btn-active': Number(pageNumber) - 1 === pageIndex,
                  })}
                  onClick={() => table.setPageIndex(Number(pageNumber) - 1)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="join-item btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="join-item btn"
              onClick={() => table.setPageIndex(pageIndex + 5)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>

          <div className="bg-base-100 mt-4 md:col-span-2 flex gap-2 justify-center">
            <button className="btn btn-success" onClick={handleSubmit(onSubmit)}>
              <CheckIcon className="w-4"></CheckIcon> 儲存
            </button>
            <button
              className="btn btn-error btn-base-200"
              type="button"
              onClick={() => router.back()}
            >
              <XMarkIcon className="w-4"></XMarkIcon> 取消
            </button>
          </div>
        </div>
      </div>

      <ArtworksSelector
        isOpen={isOpenArtworksSelector}
        onClose={(selectedArtworks) => {
          if (selectedArtworks && selectedArtworks.length > 0) {
            setArtworks((currentArtworks) => [...currentArtworks, ...selectedArtworks]);
          }
          setIsOpenArtworksSelector(false);
        }}
      ></ArtworksSelector>
    </>
  );
};

export default PurchaseOrderAdd;
