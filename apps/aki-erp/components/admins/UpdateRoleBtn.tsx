import Button from '@components/shared/Button';
import Dialog from '@components/shared/Dialog';
import { fetchRoles, sendEmailAuth } from '@data-access/apis';
import { User } from '@data-access/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError, showSuccess } from '@utils/swalUtil';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import VerifyCodeDialog from './VerifyCodeDialog';

type FormData = {
  account?: string;
  name?: string;
};

interface UpdateRoleBtnProps {
  user: User;
}

const schema = yup.object().shape({
  account: yup.string().required('必填項目'),
  name: yup.string().required('必填項目'),
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

const UpdateRoleBtn: React.FC<UpdateRoleBtnProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['fetchRoles'],
    queryFn: () => fetchRoles(),
    keepPreviousData: true,
  });

  const sendMutation = useMutation((formData: FormData) => {
    const role = data?.find((item) => item.name === formData.name);
    return sendEmailAuth(user.id, role?.id);
  });

  useEffect(() => {
    if (sendMutation.isSuccess) {
      setOpen(false);
      setVerifyOpen(true);
      showSuccess('發送驗證信成功');
    }
    if (sendMutation.isError) showError('發送驗證信失敗');
  }, [sendMutation.isSuccess, sendMutation.isError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFieldForm({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
    defaultValues: {
      account: user.account,
      name: user.name,
    },
  });

  const onSubmit = (formData: FormData) => {
    sendMutation.mutate(formData);
  };

  return (
    <>
      <button className="btn btn-warning" onClick={() => setOpen(true)}>
        角色變更
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-4 text-lg font-bold">角色變更</h3>

        <section className="flex flex-wrap items-end gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label className="font-bold">帳號</label>
            <div className="relative flex-1">
              <input
                disabled
                className="input input-bordered w-full text-center"
                {...register('account')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold">角色</label>
            <div className="relative">
              <select
                className={cx('select select-bordered w-full max-w-xs text-lg', {
                  'input-error': errors.name,
                })}
                data-testid="assetsType"
                {...register('name')}
              >
                {data?.map((item) => (
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

          <Button
            className="btn btn-warning"
            isLoading={sendMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            修改
          </Button>
        </section>
      </Dialog>

      <VerifyCodeDialog open={verifyOpen} onClose={() => setVerifyOpen(false)} />
    </>
  );
};

export default UpdateRoleBtn;
