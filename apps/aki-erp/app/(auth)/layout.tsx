'use client';

import { useEffect, useState } from 'react';

import { Container } from '@components/shared/layout';
import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>();

  const { isFetching, isError } = useQuery({
    queryKey: ['fetchUsersId', userId],
    queryFn: () => fetchUsersId(userId || ''),
    enabled: !!userId,
    keepPreviousData: true,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    userId ? setUserId(userId) : redirect('/login');
  }, []);

  if (isError) redirect('/login');

  if (isFetching)
    return (
      <div className="flex h-[100vh] items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return <Container>{children}</Container>;
};

export default AuthLayout;
