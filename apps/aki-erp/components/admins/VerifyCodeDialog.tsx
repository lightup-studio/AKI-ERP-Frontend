import Button from '@components/shared/Button';
import Dialog, { DialogProps } from '@components/shared/Dialog';
import { verifyEmail } from '@data-access/apis';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError, showSuccess } from '@utils/swalUtil';
import React, { useEffect } from 'react';
import * as yup from 'yup';

type FormData = {
  code: string;
};

const schema = yup.object().shape({
  code: yup.string().required('必填項目'),
});

const configs: FieldConfig<FormData>[] = [
  {
    type: 'TEXT',
    name: 'code',
    label: '驗證碼',
  },
];

const VerifyCodeDialog: React.FC<DialogProps> = (props) => {
  const verifyMutation = useMutation((formData: FormData) => {
    return verifyEmail(formData.code);
  });

  const { fieldForm, handleSubmit } = useFieldForm({
    configs: configs,
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData: FormData) => {
    verifyMutation.mutate(formData);
  };

  useEffect(() => {
    if (verifyMutation.isSuccess) {
      props.onClose();
      showSuccess('驗證成功');
    }
    if (verifyMutation.isError) showError('驗證失敗');
  }, [verifyMutation.isSuccess, verifyMutation.isError]);

  return (
    <Dialog {...props}>
      <h3 className="mb-4 text-lg font-bold">請輸入驗證碼</h3>

      <div className="mb-4">{fieldForm}</div>

      <Button
        className="btn btn-info"
        isLoading={verifyMutation.isLoading}
        onClick={handleSubmit(onSubmit)}
      >
        驗證
      </Button>
    </Dialog>
  );
};

export default VerifyCodeDialog;
