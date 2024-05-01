'use client';

import { UpdateRoleBtn } from '@components/admins';
import { PAGE_SIZES } from '@constants/page.constant';
import { createUser, deleteUser, fetchRoles, fetchUsers } from '@data-access/apis';
import { User } from '@data-access/models';
import { PlusIcon } from '@heroicons/react/20/solid';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { useFieldForm, useTable } from '@utils/hooks';
import { FieldConfig } from '@utils/hooks/useFieldForm';
import usePermission, { Action } from '@utils/hooks/usePermission';
import { showConfirm } from '@utils/swalUtil';
import cx from 'classnames';
import { useSearchParams } from 'next/navigation';
import * as yup from 'yup';

type FormData = {
  account: string;
  name: string;
};

const schema = yup.object().shape({
  account: yup.string().required('帳號必填'),
  name: yup.string().required('角色必填'),
});

const configs: FieldConfig<FormData>[] = [
  {
    type: 'TEXT',
    name: 'account',
    label: '帳號',
  },
  {
    type: 'TEXT',
    name: 'name',
    label: '角色',
  },
];

const Admins = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useFieldForm({
    configs: configs,
    resolver: yupResolver(schema),
  });

  const columns: ColumnDef<User, any>[] = [
    {
      id: 'account',
      header: '帳號',
      accessorKey: 'account',
    },
    {
      id: 'name',
      header: '角色',
      accessorKey: 'name',
    },
    {
      id: 'status',
      header: '狀態',
      accessorKey: 'status',
    },
    {
      id: 'action',
      header: '功能',
      accessorKey: 'action',
      cell: ({ row }) => {
        const roleId = roles?.find((item) => item.name === row.original.name)?.id;
        return <UpdateRoleBtn user={row.original} />;
      },
    },
  ];

  const searchParams = useSearchParams();

  const { hasPermission } = usePermission();

  const params = new URLSearchParams(searchParams);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['fetchUsers', params.toString()],
    queryFn: () => fetchUsers(params.toString()),
    keepPreviousData: true,
  });

  const { data: roles } = useQuery({
    queryKey: ['fetchRoles'],
    queryFn: () => fetchRoles(),
    keepPreviousData: true,
  });

  const { table, tableBlock, selectedRows, selectedRowsCount, clearRowSelection } = useTable<User>({
    data: data?.data,
    totalCount: data?.totalCount,
    columns: columns,
    isLoading: isFetching,
  });

  const createMutation = useMutation((formData: FormData) => createUser(formData), {
    onSuccess: () => {
      reset();
      refetch();
    },
  });

  const deleteMutation = useMutation(
    (users: User[]) => {
      return Promise.all(users.map((item) => deleteUser(item.id)));
    },
    {
      onSuccess: () => {
        clearRowSelection();
        refetch();
      },
    },
  );

  const onSubmit = (formData: FormData) => {
    createMutation.mutateAsync(formData);
  };

  const handleDelete = async () => {
    const { isConfirmed } = await showConfirm({
      title: '確定刪除管理者嗎？',
      icon: 'warning',
    });

    if (!isConfirmed) return;
    deleteMutation.mutate(selectedRows);
  };

  return (
    <div className="flex flex-col gap-4">
      {hasPermission([Action.CREATE_ADMIN]) && (
        <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
          <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">新增管理者</h2>

          <form className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1">
              <label className="font-bold">帳號</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.account,
                  })}
                  placeholder="請輸入帳號"
                  {...register('account')}
                />
                {errors.account && (
                  <p className="text-error absolute text-xs italic">{errors.account?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold">角色</label>
              <div className="relative">
                <select
                  className={cx('select select-bordered w-full max-w-xs text-lg', {
                    'input-error': errors.name,
                  })}
                  data-testid="name"
                  {...register('name')}
                >
                  <option value="">請選擇</option>
                  {roles?.map((item) => (
                    <option
                      key={`name__option-${item.id}`}
                      data-testid={`name__option-${item.id}`}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
                {errors.name && (
                  <p className="text-error absolute text-xs italic">{errors.name.message}</p>
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
        <h2 className="border-accent mb-6 border-l-8 pl-4 text-xl font-bold">管理者列表</h2>

        <div className="flex items-center gap-2">
          <span>已選擇 {selectedRowsCount} 筆</span>

          {hasPermission([Action.DELETE_ADMIN]) && (
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
  );
};

export default Admins;
