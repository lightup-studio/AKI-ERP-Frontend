import Button from '@components/shared/Button';
import { updateUser } from '@data-access/apis';
import { User } from '@data-access/models';
import { useMutation } from '@tanstack/react-query';
import { formatDateTime } from '@utils/format';
import { useFieldForm } from '@utils/hooks';
import { FieldConfig } from '@utils/hooks/useFieldForm';
import React, { useEffect } from 'react';

type FormData = {
  name?: string;
  account?: string;
  createTime?: string;
};

interface ProfileFormProps {
  data: User;
  refetch: () => void;
}

const configs: FieldConfig[] = [
  {
    type: 'TEXT',
    name: 'name',
    label: 'Name',
  },
  {
    type: 'TEXT',
    name: 'account',
    label: '帳號',
  },
  {
    type: 'TEXT',
    name: 'createTime',
    label: '創建時間',
  },
];

const ProfileForm: React.FC<ProfileFormProps> = ({ data, refetch }) => {
  const { fieldForm, handleSubmit } = useFieldForm<FormData>({
    configs: configs,
    defaultValues: {
      name: data.name,
      account: data.account,
      createTime: formatDateTime(data.createTime),
    },
  });

  const updateMutation = useMutation((formData: FormData) =>
    updateUser(data.id, {
      name: formData.name,
      account: formData.account,
    }),
  );

  const onSubmit = (formData: FormData) => {
    updateMutation.mutateAsync(formData);
  };

  useEffect(() => {
    if (updateMutation.data) refetch();
  }, [updateMutation.data]);

  return (
    <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>

      <div className="divider"></div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{fieldForm}</div>

      <div className="my-16">
        <Button
          className="btn btn-primary float-right"
          isLoading={updateMutation.isLoading}
          onClick={handleSubmit(onSubmit)}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
