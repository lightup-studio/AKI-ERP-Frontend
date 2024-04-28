'use client';

import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';

const useMe = () => {
  const userId = localStorage.getItem('userId') || '';

  return useQuery({
    queryKey: ['fetchUsersId', userId],
    queryFn: () => fetchUsersId(userId),
    retry: 1,
    enabled: true,
    refetchOnMount: false,
  });
};

export default useMe;
