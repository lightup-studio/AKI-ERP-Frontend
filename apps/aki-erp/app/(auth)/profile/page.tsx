'use client';

import { ProfileForm } from '@components/profile';
import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const ProfileSettings = () => {
  const [userId, setUserId] = useState<string | null>();

  const { data, refetch } = useQuery({
    queryKey: ['fetchUsersId'],
    queryFn: () => fetchUsersId(userId || ''),
    enabled: !!userId,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

  return <>{data && <ProfileForm data={data} refetch={refetch} />}</>;
};

export default ProfileSettings;
