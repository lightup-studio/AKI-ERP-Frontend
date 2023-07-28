'use client';

import React, { useEffect, useMemo, useState } from 'react';

import UpdateCustomerDialog from '@components/collector/UpdateCustomerDialog';
import IndeterminateCheckbox from '@components/shared/field/IndeterminateCheckbox';
import SearchInput from '@components/shared/field/SearchField';
import { formSchema } from '@constants/collector.formSchema';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ColumnDef,
  PaginationState,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import usePagination, { DOTS } from '@utils/hooks/usePagination';
import cx from 'classnames';
import { createPartner, deletePartnerList, fetchPartnerList } from 'data-access/apis/partners.api';
import { CustomerPartner } from 'data-access/models';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

const Collector = () => {
  const [updateArtistDialogData, setUpdateArtistDialogData] = useState<{
    isOpen: boolean;
    data?: CustomerPartner;
  }>({
    isOpen: false,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const [keyword, setKeyword] = useState(params.get('keyword'));

  useEffect(() => {
    keyword ? params.set('keyword', keyword) : params.delete('keyword');
    params.delete('pageIndex');
    router.push(`${pathname}?${params.toString()}`);
  }, [keyword]);

  const handleSearch = (keyword?: string | null) => {
    setKeyword(keyword || '');
    setPagination(({ pageSize }) => ({ pageIndex: 0, pageSize }));
  };

  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: +(searchParams.get('pageIndex') || 0),
    pageSize: +(searchParams.get('pageSize') || 50),
  });
  const pagination = useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  useEffect(() => {
    if (
      pageIndex === +(searchParams.get('pageIndex') || 0) &&
      pageSize === +(searchParams.get('pageSize') || 50)
    ) {
      return;
    }
  });

  useEffect(() => {
    if (
      pageIndex === +(params.get('pageIndex') || 0) &&
      pageSize === +(params.get('pageSize') || 50)
    ) {
      return;
    }

    pageIndex > 0 ? params.set('pageIndex', `${pageIndex}`) : params.delete('pageIndex');
    pageSize !== 50 ? params.set('pageSize', `${pageSize}`) : params.delete('pageSize');
    router.push(`${pathname}?${searchParams.toString()}`);
  }, [pageIndex, pageSize, searchParams]);

  const dataQuery = useQuery(
    ['data', searchParams.toString()],
    () =>
      fetchPartnerList({
        type: 'Customer',
        keyword: searchParams.get('keyword'),
        offset: +(searchParams.get('pageIndex') || 0),
        take: +(searchParams.get('pageSize') || 50),
      }),
    { keepPreviousData: true }
  );

  const createMutation = useMutation((data: CustomerPartner) => createPartner(data), {
    onSuccess: () => {
      if ([...searchParams.values()].length > 0) {
        setKeyword('');
        setPagination(() => ({ pageIndex: 0, pageSize: 50 }));
      } else {
        dataQuery.refetch();
      }
      reset();
    },
  });
  const deleteMutation = useMutation((ids: number[]) => deletePartnerList(ids), {
    onSuccess: () => {
      if ([...searchParams.values()].length > 0) {
        setKeyword('');
        setPagination(() => ({ pageIndex: 0, pageSize: 50 }));
      } else {
        dataQuery.refetch();
      }
      setRowSelection({});
    },
  });

  const [tableData, setTableData] = useState<CustomerPartner[]>([]);

  useEffect(() => {
    if (dataQuery.isSuccess) {
      const tableData = structuredClone(dataQuery.data.data);
      setTableData(tableData);
    }
  }, [dataQuery.isSuccess, dataQuery.data]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, CustomerPartner>>({});

  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleAllRowSelectionChange = (rows: Row<CustomerPartner>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<CustomerPartner>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const isLoading = dataQuery.isLoading || createMutation.isLoading || deleteMutation.isLoading;

  const columns: ColumnDef<CustomerPartner, any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center">
          <IndeterminateCheckbox
            {...{
              checked:
                dataQuery.data?.totalCount !== 0 && selectedRowCount === dataQuery.data?.totalCount,
              indeterminate:
                selectedRowCount > 0 && selectedRowCount < (dataQuery.data?.totalCount || 0),
              onChange: () => handleAllRowSelectionChange(table.getRowModel().rows),
              disabled: dataQuery.data?.totalCount === 0 || isLoading,
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
      id: 'id',
      header: 'ID',
      accessorKey: 'id',
      cell: ({ cell, row }) => (
        <button
          className="text-info"
          onClick={() =>
            setUpdateArtistDialogData({
              isOpen: true,
              data: structuredClone(row.original),
            })
          }
          disabled={isLoading}
        >
          {cell.getValue()} <PencilSquareIcon className="h-4 w-4 inline-block" />
        </button>
      ),
    },
    {
      id: 'name',
      header: '藏家名稱',
      cell: ({ row, cell }) => (
        <>
          {row.original.zhName} {row.original.enName}
        </>
      ),
    },
    {
      id: 'telephone',
      header: '電話',
      accessorKey: 'telephone',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'metadata.email',
    },
    {
      id: 'address',
      header: '地址',
      accessorKey: 'address',
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount: dataQuery.data?.pageCount ?? -1,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: setPagination,
  });

  const paginationRange = usePagination({
    currentPage: pageIndex,
    totalCount: dataQuery.data?.totalCount ?? 0,
    siblingCount: 1,
    pageSize: pageSize,
  });

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CustomerPartner>({
    defaultValues: {
      type: 'Customer',
      zhName: '',
      enName: '',
      address: '',
      telephone: '',
      metadata: {
        email: '',
      },
    },
    resolver: yupResolver<any>(formSchema),
    mode: 'onTouched',
  });

  const handleCloseUpdateArtistDialog = () => {
    setUpdateArtistDialogData({ isOpen: false, data: undefined });
    dataQuery.refetch();
  };

  const handleDelete = () => {
    const ids = Object.keys(rowSelection).map((key) => +key);
    deleteMutation.mutateAsync(ids);
  };

  const onSubmit = (data: CustomerPartner) => {
    createMutation.mutateAsync(data);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="card w-full p-6 bg-base-100 shadow-xl">
          <h2 className="text-xl font-bold border-l-8 border-accent pl-4 mb-6">新增藏家</h2>

          <form className="flex flex-wrap gap-3 items-end" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1">
              <label className="font-bold">藏家姓名</label>
              <div className="relative flex-1 whitespace-nowrap">
                <input
                  className={cx('input input-bordered w-32 text-center rounded-r-none', {
                    'input-error': errors.zhName,
                  })}
                  placeholder="中文姓名"
                  {...register('zhName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                <input
                  className={cx('input input-bordered w-56 text-center rounded-l-none', {
                    'input-error': errors.enName,
                  })}
                  placeholder="英文姓名"
                  {...register('enName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                {(errors.zhName || errors.enName) && (
                  <p className="absolute text-error text-xs italic">
                    {(errors.zhName || errors.enName)?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">電話</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.telephone,
                  })}
                  placeholder="請輸入電話"
                  {...register('telephone')}
                />
                {errors.telephone && (
                  <p className="absolute text-error text-xs italic">{errors.telephone?.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">Email</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors?.metadata?.email,
                  })}
                  placeholder="請輸入 Email"
                  {...register('metadata.email')}
                />
                {errors?.metadata?.email && (
                  <p className="absolute text-error text-xs italic">
                    {errors.metadata.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">地址</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.address,
                  })}
                  placeholder="請輸入地址"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="absolute text-error text-xs italic">{errors.address?.message}</p>
                )}
              </div>
            </div>
            <button className="btn btn-info">
              <PlusIcon className="h-5 w-5"></PlusIcon>
            </button>
          </form>
        </div>

        <div className="card w-full p-6 bg-base-100 shadow-xl">
          <h2 className="text-xl font-bold border-l-8 border-accent pl-4 mb-6">藏家列表</h2>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex-grow">
              <div className="md:w-1/2 mb-3">
                <SearchInput value={keyword} onSearch={handleSearch} />
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-between">
              <div className="flex md:flex-col gap-2">
                <button aria-label="export pdf file" className="btn btn-accent flex-1">
                  表格匯出
                </button>
              </div>
              <i className="flex-grow"></i>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2 mb-2">
            <span>已選擇 {selectedRowCount} 筆</span>
            <button
              className="btn btn-error"
              onClick={handleDelete}
              disabled={isLoading || selectedRowCount === 0}
            >
              <TrashIcon className="h-5 w-5"></TrashIcon>
              刪除
            </button>
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

          <div className="h-full w-full pb-6 bg-base-100 text-center">
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="text-lg">
                      {headerGroup.headers.map((header) => {
                        return (
                          <td
                            key={header.id}
                            colSpan={header.colSpan}
                            className={cx('px-2', {
                              'w-[1rem]': ['select'].includes(header.column.id),
                            })}
                          >
                            {header.isPlaceholder ? null : (
                              <div>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody className="relative">
                  {isLoading && (
                    <tr className="absolute bg-base-200 flex h-full inset-0 items-center justify-center opacity-50 w-full">
                      <td colSpan={6}>
                        <span className="loading loading-bars loading-xs"></span>
                      </td>
                    </tr>
                  )}
                  {table.getRowModel().rows.length === 0 && (
                    <tr className="bg-base-200 text-base-content">
                      <td colSpan={6}>
                        <div className="flex justify-center items-center min-h-[3rem]">
                          {!isLoading && '沒有藏家資料'}
                        </div>
                      </td>
                    </tr>
                  )}
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr key={row.id} className="text-[1rem]">
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className={cx('p-2', {
                                'w-[15rem]': ['id', 'telephone'].includes(cell.column.id),
                              })}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
          </div>
        </div>
      </div>

      <UpdateCustomerDialog
        {...updateArtistDialogData}
        onClose={handleCloseUpdateArtistDialog}
      ></UpdateCustomerDialog>
    </>
  );
};

export default Collector;
