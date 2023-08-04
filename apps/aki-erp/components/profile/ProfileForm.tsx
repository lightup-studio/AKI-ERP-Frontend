import { User } from '@data-access/models';
import { useFieldForm } from '@utils/hooks';
import { FieldConfig } from '@utils/hooks/useFieldForm';
import React from 'react';

type FormData = {
  name?: string;
  email?: string;
  title?: string;
  place?: string;
  about?: string;
  language?: string;
  timezone?: string;
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
    name: 'email',
    label: 'Email',
  },
  {
    type: 'TEXT',
    name: 'title',
    label: 'Title',
  },
  {
    type: 'TEXT',
    name: 'place',
    label: 'Place',
  },
  {
    type: 'TEXT',
    name: 'about',
    label: 'About',
  },
  {
    type: 'TEXT',
    name: 'language',
    label: 'Language',
  },
  {
    type: 'TEXT',
    name: 'timezone',
    label: 'Timezone',
  },
];

const ProfileForm: React.FC<ProfileFormProps> = ({ data }) => {
  const { fieldForm } = useFieldForm<FormData>({
    configs: configs,
    defaultValues: {
      name: data?.name,
      email: 'alex@dashwind.com',
      title: 'UI/UX Designer',
      place: 'California',
      about: 'Doing what I love, part time traveller',
      language: 'English',
      timezone: 'IST',
    },
  });

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl">
      <h1 className="text-2xl font-semibold ml-2">Profile Settings</h1>

      <div className="divider"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{fieldForm.slice(0, 4)}</div>

      <div className="divider"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{fieldForm.slice(4)}</div>

      <div className="mt-16">
        <button className="btn btn-primary float-right">Update</button>
      </div>
    </div>
  );
};

export default ProfileForm;
