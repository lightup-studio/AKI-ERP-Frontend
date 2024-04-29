'use client';

import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useMe = () => {
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || '';

    if (userId) {
      setUserId(userId);
      setIsError(false);
    } else {
      setData(null);
      setUserId('');
      setIsError(true);
    }
  }, [userId]);

  const query = useQuery({
    queryKey: ['fetchUsersId'],
    queryFn: () => fetchUsersId(userId),
    retry: 0,
    enabled: !!userId,
  });

  if (query.isError) setIsError(true);

  return userId ? query : { ...query, data, isError };
};

export default useMe;
