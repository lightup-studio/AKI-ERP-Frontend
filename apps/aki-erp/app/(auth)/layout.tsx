'use client';

import { Container } from '@components/shared/layout';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    token ? setToken(token) : router.push('/login');
  }, []);

  if (!token) return <></>;

  return <Container>{children}</Container>;
};

export default AuthLayout;
