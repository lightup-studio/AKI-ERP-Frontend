'use client';

import { Container } from '@components/shared/layout';
import { useMe } from '@utils/hooks';
import { redirect } from 'next/navigation';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { isFetching, isError } = useMe();

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
