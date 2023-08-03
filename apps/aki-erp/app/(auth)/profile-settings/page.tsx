'use client';

import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';
import { useFieldForm } from '@utils/hooks';
import { FieldConfig } from '@utils/hooks/useFieldForm';
import { useEffect, useState } from 'react';

type FormData = {
  name?: string;
  email?: string;
  title?: string;
  place?: string;
  about?: string;
  language?: string;
  timezone?: string;
};

const ProfileSettings = () => {
  const [userId, setUserId] = useState<string | null>();

  const { data, isFetched } = useQuery({
    queryKey: ['fetchUsersId'],
    queryFn: () => fetchUsersId(userId || 'undefined'),
    enabled: !!userId,
  });

  const configs: FieldConfig[] = [
    {
      type: 'TEXT',
      name: 'name',
      label: 'Name',
      defaultValue: data?.name,
    },
    {
      type: 'TEXT',
      name: 'email',
      label: 'Email',
      defaultValue: 'alex@dashwind.com',
    },
    {
      type: 'TEXT',
      name: 'title',
      label: 'Title',
      defaultValue: 'UI/UX Designer',
    },
    {
      type: 'TEXT',
      name: 'place',
      label: 'Place',
      defaultValue: 'California',
    },
    {
      type: 'TEXT',
      name: 'about',
      label: 'About',
      defaultValue: 'Doing what I love, part time traveller',
    },
    {
      type: 'TEXT',
      name: 'language',
      label: 'Language',
      defaultValue: 'English',
    },
    {
      type: 'TEXT',
      name: 'timezone',
      label: 'Timezone',
      defaultValue: 'IST',
    },
  ];

  const { fieldForm, setValue } = useFieldForm<FormData>({ configs: configs });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

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

export default ProfileSettings;
