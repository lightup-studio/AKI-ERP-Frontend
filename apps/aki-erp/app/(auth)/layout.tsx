'use client';

import { Container } from '@components/shared/layout';
import { useRouter } from 'next/navigation';

const token = localStorage.getItem('token');

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  if (!token) {
    router.push('/login');
    return <></>;
  }

  return <Container>{children}</Container>;
};

export default AuthLayout;
