import { User } from '@data-access/models';
import { formatDateTime } from '@utils/format';
import { useFieldForm } from '@utils/hooks';
import { FieldConfig } from '@utils/hooks/useFieldForm';
import React from 'react';

type FormData = {
  name?: string;
  account?: string;
  createTime?: string;
};

interface ProfileFormProps {
  data: User;
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

const ProfileForm: React.FC<ProfileFormProps> = ({ data }) => {
  const { fieldForm } = useFieldForm<FormData>({
    configs: configs,
    defaultValues: {
      name: data.name,
      account: data.account,
      createTime: formatDateTime(data.createTime),
    },
  });

  return (
    <div className="card bg-base-100 min-h-full w-full p-6 shadow-xl">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>

      <div className="divider"></div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{fieldForm}</div>

      <div className="my-16">
        <button className="btn btn-primary float-right">Update</button>
      </div>
    </div>
  );
};

export default ProfileForm;
