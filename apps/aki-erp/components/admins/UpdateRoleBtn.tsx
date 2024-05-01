import Button from '@components/shared/Button';
import Dialog from '@components/shared/Dialog';
import { fetchRoles, sendEmailAuth, verifyEmail } from '@data-access/apis';
import { User } from '@data-access/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError, showSuccess } from '@utils/swalUtil';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import * as yup from 'yup';

type FormData = {
  account?: string;
  name?: string;
  code?: string;
};

interface UpdateRoleBtnProps {
  user: User;
}

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
  {
    type: 'TEXT',
    name: 'code',
    label: '驗證碼',
  },
];

const UpdateRoleBtn: React.FC<UpdateRoleBtnProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const schema = yup.object().shape({
    account: yup.string().required('必填項目'),
    name: yup.string().required('必填項目'),
    code: yup.string().when('code valid', (value, schema) => {
      if (showCode) return schema.required('必填項目');
      return schema;
    }),
  });

  const {
    reset,
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

  const { data } = useQuery({
    queryKey: ['fetchRoles'],
    queryFn: () => fetchRoles(),
    keepPreviousData: true,
  });

  const sendMutation = useMutation((formData: FormData) => {
    const role = data?.find((item) => item.name === formData.name);
    return sendEmailAuth(user.id, role?.id);
  });

  const verifyMutation = useMutation((formData: FormData) => {
    return verifyEmail(formData.code);
  });

  useEffect(() => {
    if (sendMutation.isError) showError('發送驗證信失敗');
    if (sendMutation.isSuccess) setShowCode(true);

    if (showCode && verifyMutation.isError) showError('驗證失敗');
    if (showCode && verifyMutation.isSuccess) {
      reset();
      showSuccess('驗證成功');
      setShowCode(false);
      setOpen(false);
    }
  }, [
    sendMutation.isSuccess,
    sendMutation.isError,
    verifyMutation.isSuccess,
    verifyMutation.isError,
  ]);

  const onSendEmail = (formData: FormData) => {
    sendMutation.mutate(formData);
  };

  const onValidCode = (formData: FormData) => {
    verifyMutation.mutate(formData);
  };

  return (
    <>
      <button className="btn btn-warning" onClick={() => setOpen(true)}>
        角色變更
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-4 text-lg font-bold">角色變更</h3>

        <section className="flex flex-wrap items-end gap-3">
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

          {showCode && (
            <div className="flex flex-col gap-1">
              <label className="font-bold">驗證碼</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.code,
                  })}
                  {...register('code')}
                />
                {errors.code && (
                  <p className="text-error absolute text-xs italic">{errors.code.message}</p>
                )}
              </div>
            </div>
          )}

          {showCode ? (
            <Button
              className="btn btn-info"
              isLoading={verifyMutation.isLoading}
              onClick={handleSubmit(onValidCode)}
            >
              驗證
            </Button>
          ) : (
            <Button
              className="btn btn-info"
              isLoading={sendMutation.isLoading}
              onClick={handleSubmit(onSendEmail)}
            >
              寄送驗證信
            </Button>
          )}
        </section>
      </Dialog>
    </>
  );
};

export default UpdateRoleBtn;
