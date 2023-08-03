'use client';

import { useEffect, useState } from 'react';

import { Container } from '@components/shared/layout';
import { fetchUsersId } from '@data-access/apis';
import { useQuery } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>();

  const { isFetching, isError } = useQuery({
    queryKey: ['PurchaseReturnOrder', userId],
    queryFn: () => fetchUsersId(userId || 'undefined'),
    keepPreviousData: true,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUserId(userId);
  }, []);

  if (isError) redirect('/login');

  if (isFetching)
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return <Container>{children}</Container>;
};

export default AuthLayout;
