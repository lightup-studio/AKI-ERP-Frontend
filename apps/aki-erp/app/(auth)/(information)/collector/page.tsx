'use client';

import { useEffect, useState } from 'react';

import UpdateCustomerDialog from '@components/collector/UpdateCustomerDialog';
import SearchInput from '@components/shared/field/SearchField';
import { formSchema } from '@constants/collector.formSchema';
import { DEFAULT_PAGE_SIZE, PAGE_SIZES } from '@constants/page.constant';
import { usefetchPartnerList } from '@data-access/hooks';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '@utils/hooks';
import usePermission, { Action } from '@utils/hooks/usePermission';
import cx from 'classnames';
import { createPartner, deletePartnerList } from 'data-access/apis/partners.api';
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
  const pageIndex = +(params.get('pageIndex') || 0);
  const pageSize = +(params.get('pageSize') || DEFAULT_PAGE_SIZE);

  const [keyword, setKeyword] = useState(params.get('keyword'));

  const { hasPermission } = usePermission();

  useEffect(() => {
    keyword ? params.set('keyword', keyword) : params.delete('keyword');
    params.delete('pageIndex');
    router.push(`${pathname}?${params.toString()}`);
  }, [keyword]);

  const handleSearch = (keyword?: string | null) => {
    setKeyword(keyword || '');
  };

  const dataQuery = usefetchPartnerList({ type: 'Customer', keyword, pageIndex, pageSize });

  const createMutation = useMutation((data: CustomerPartner) => createPartner(data), {
    onSuccess: () => {
      dataQuery.refetch();
      reset();
    },
  });

  const deleteMutation = useMutation((ids: number[]) => deletePartnerList(ids), {
    onSuccess: () => {
      dataQuery.refetch();
      clearRowSelection();
    },
  });

  const isLoading = dataQuery.isLoading || createMutation.isLoading || deleteMutation.isLoading;

  const columns: ColumnDef<CustomerPartner, any>[] = [
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
    {
      id: 'else',
      header: '其他',
      accessorKey: 'metadata.else',
    },
  ];

  const { table, tableBlock, selectedRows, selectedRowsCount, clearRowSelection } =
    useTable<CustomerPartner>({
      data: dataQuery.data?.data,
      totalCount: dataQuery.data?.totalCount,
      columns: columns,
      isLoading: isLoading,
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
        else: '',
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
    const ids = selectedRows.map((item) => item.id);
    deleteMutation.mutateAsync(ids);
  };

  const onSubmit = (data: CustomerPartner) => {
    createMutation.mutateAsync(data);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {hasPermission([Action.CREATE_COLLECTOR]) && (
          <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
            <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">新增藏家</h2>

            <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1">
                <label className="font-bold">藏家姓名</label>
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
                    <p className="text-error absolute text-xs italic">
                      {errors.telephone?.message}
                    </p>
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
              <div className="flex flex-col gap-1">
                <label className="font-bold">其他</label>
                <div className="relative flex-1">
                  <input
                    className={cx('input input-bordered w-full text-center', {
                      'input-error': errors?.metadata?.else,
                    })}
                    {...register('metadata.else')}
                  />
                  {errors?.metadata?.else && (
                    <p className="text-error absolute text-xs italic">
                      {errors?.metadata?.else?.message}
                    </p>
                  )}
                </div>
              </div>
              <button className="btn btn-info">
                <PlusIcon className="h-5 w-5"></PlusIcon>
              </button>
            </form>
          </div>
        )}

        <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
          <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">藏家列表</h2>

          <div className="flex flex-col gap-2 md:flex-row">
            <div className="flex-grow">
              <div className="mb-3 md:w-1/2">
                <SearchInput value={keyword} onSearch={handleSearch} />
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
            <span>已選擇 {selectedRowsCount} 筆</span>

            {hasPermission([Action.DELETE_COLLECTOR]) && (
              <button
                className="btn btn-error"
                disabled={selectedRowsCount === 0}
                onClick={handleDelete}
              >
                <TrashIcon className="h-5 w-5"></TrashIcon>
                刪除
              </button>
            )}

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

          <div className="bg-base-100 h-full w-full pb-6 text-center">{tableBlock}</div>
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
