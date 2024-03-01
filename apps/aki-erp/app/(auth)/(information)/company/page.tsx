'use client';

import React, { useEffect, useMemo, useState } from 'react';

import UpdateCompanyDialog from '@components/company/UpdateCompanyList';
import Table from '@components/shared/Table';
import IndeterminateCheckbox from '@components/shared/field/IndeterminateCheckbox';
import SearchField from '@components/shared/field/SearchField';
import { formSchema } from '@constants/company.formSchema';
import { usefetchPartnerList } from '@data-access/hooks';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import {
  ColumnDef,
  PaginationState,
  Row,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import usePagination, { DOTS } from '@utils/hooks/usePagination';
import cx from 'classnames';
import { createPartner, deletePartnerList } from 'data-access/apis/partners.api';
import { CompanyPartner } from 'data-access/models';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

const Company = () => {
  const [updateArtistDialogData, setUpdateArtistDialogData] = useState<{
    isOpen: boolean;
    data?: CompanyPartner;
  }>({
    isOpen: false,
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = new URLSearchParams(searchParams);

  const [keyword, setKeyword] = useState(searchParams.get('keyword'));

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
      pageIndex === +(params.get('pageIndex') || 0) &&
      pageSize === +(params.get('pageSize') || 50)
    ) {
      return;
    }

    pageIndex > 0 ? params.set('pageIndex', `${pageIndex}`) : params.delete('pageIndex');
    pageSize !== 50 ? params.set('pageSize', `${pageSize}`) : params.delete('pageSize');
    router.push(`${pathname}?${searchParams.toString()}`);
  }, [pageIndex, pageSize, searchParams]);

  const dataQuery = usefetchPartnerList('Company');

  const createMutation = useMutation((data: CompanyPartner) => createPartner(data), {
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

  const [tableData, setTableData] = useState<CompanyPartner[]>([]);

  useEffect(() => {
    if (dataQuery.isSuccess) {
      const tableData = structuredClone(dataQuery.data.data);
      setTableData(tableData);
    }
  }, [dataQuery.isSuccess, dataQuery.data]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, CompanyPartner>>({});

  const selectedRowCount = useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

  const handleAllRowSelectionChange = (rows: Row<CompanyPartner>[]) => {
    const selectedRows = rows.filter((row) => row.original.id in rowSelection);
    const isAnyRowSelected = selectedRows.length > 0;

    if (isAnyRowSelected) {
      selectedRows.forEach((row) => delete rowSelection[row.original.id]);
    } else {
      rows.forEach((row) => (rowSelection[row.original.id] = row.original));
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const handleRowSelectionChange = (row: Row<CompanyPartner>) => {
    const { id } = row.original;

    if (id in rowSelection) {
      delete rowSelection[id];
    } else {
      rowSelection[id] = row.original;
    }

    setRowSelection(structuredClone(rowSelection));
  };

  const isLoading = dataQuery.isLoading || createMutation.isLoading || deleteMutation.isLoading;

  const columns: ColumnDef<CompanyPartner, any>[] = [
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
          {cell.getValue()} <PencilSquareIcon className="inline-block h-4 w-4" />
        </button>
      ),
    },
    {
      id: 'name',
      header: '廠商名稱',
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
  } = useForm<CompanyPartner>({
    defaultValues: {
      type: 'Company',
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

  const onSubmit = (data: CompanyPartner) => {
    createMutation.mutateAsync(data);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
          <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">新增廠商</h2>

          <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1">
              <label className="font-bold">廠商姓名</label>
              <div className="relative flex-1 whitespace-nowrap">
                <input
                  className={cx('input input-bordered w-32 rounded-r-none text-center', {
                    'input-error': errors.zhName,
                  })}
                  placeholder="中文姓名"
                  {...register('zhName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                <input
                  className={cx('input input-bordered w-56 rounded-l-none text-center', {
                    'input-error': errors.enName,
                  })}
                  placeholder="英文姓名"
                  {...register('enName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                {(errors.zhName || errors.enName) && (
                  <p className="text-error absolute text-xs italic">
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
                  <p className="text-error absolute text-xs italic">{errors.telephone?.message}</p>
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
                  <p className="text-error absolute text-xs italic">
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
                  <p className="text-error absolute text-xs italic">{errors.address?.message}</p>
                )}
              </div>
            </div>
            <button className="btn btn-info">
              <PlusIcon className="h-5 w-5"></PlusIcon>
            </button>
          </form>
        </div>

        <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
          <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">廠商列表</h2>

          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex-grow">
              <div className="mb-3 md:w-1/2">
                <SearchField value={keyword} onSearch={handleSearch} />
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2">
              <div className="flex gap-2 md:flex-col">
                <button aria-label="export pdf file" className="btn btn-accent flex-1">
                  表格匯出
                </button>
              </div>
              <i className="flex-grow"></i>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

          <div className="bg-base-100 h-full w-full pb-6 text-center">
            <Table table={table} isLoading={isLoading} />

            <div className="divider" />

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
                    className={cx('join-item btn hidden w-14 md:block', {
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

      <UpdateCompanyDialog
        {...updateArtistDialogData}
        onClose={handleCloseUpdateArtistDialog}
      ></UpdateCompanyDialog>
    </>
  );
};

export default Company;
