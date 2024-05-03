import Button from '@components/shared/Button';
import Dialog from '@components/shared/Dialog';
import { authorizeWithPasswordByUserId } from '@data-access/apis';
import { User } from '@data-access/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError, showSuccess } from '@utils/swalUtil';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';

type FormData = {
  account?: string;
  password?: string;
};

interface UpdatePasswordBtnProps {
  user: User;
  disabled?: boolean;
}

const configs: FieldConfig<FormData>[] = [
  {
    type: 'TEXT',
    name: 'account',
    label: '帳號',
    disabled: true,
  },
  {
    type: 'PASSWORD',
    name: 'password',
    label: '密碼',
  },
];

const schema = yup.object().shape({
  account: yup.string().required('必填項目'),
  password: yup.string().required('必填項目'),
});

const UpdatePasswordBtn: React.FC<UpdatePasswordBtnProps> = ({ user, disabled }) => {
  const [open, setOpen] = useState(false);

  const { fieldForm, handleSubmit } = useFieldForm({
    configs: configs,
    resolver: yupResolver<FormData>(schema),
    defaultValues: {
      account: user.account,
    },
  });

  const mutation = useMutation((formData: FormData) => {
    return authorizeWithPasswordByUserId(user.id, formData.password);
  });

  const onSubmit = (formData: FormData) => {
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (mutation.isError) showError('變更失敗');
    if (mutation.isSuccess) {
      showSuccess('變更成功');
      setOpen(false);
    }
  }, [mutation.isSuccess, mutation.isError]);

  return (
    <>
      <button className="btn btn-warning" disabled={disabled} onClick={() => setOpen(true)}>
        密碼變更
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-4 text-lg font-bold">密碼變更</h3>

        <form className="grid w-full grid-cols-2 gap-4">{fieldForm}</form>

        <section className="mt-4 text-center">
          <Button
            className="btn btn-info"
            isLoading={mutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            變更
          </Button>
        </section>
      </Dialog>
    </>
  );
};

export default UpdatePasswordBtn;
