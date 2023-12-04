'use client';

import { useEffect } from 'react';

import { AxiosError } from 'axios';
import { authorizeWithPassword } from 'data-access/apis/authorizations.api';
import { AuthorizeWithPasswordResponse } from 'data-access/models';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

import Button from '@components/shared/Button';
import Image from '@components/shared/Image';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError } from '@utils/swalUtil';

type FormData = {
  username: string;
  password: string;
};

const schema = yup.object().shape({
  username: yup.string().required('請輸入帳號'),
  password: yup.string().required('請輸入密碼'),
});

const configs: FieldConfig<FormData>[] = [
  {
    type: 'TEXT',
    name: 'username',
    label: 'username',
  },
  {
    type: 'PASSWORD',
    name: 'password',
    label: 'password',
  },
];

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
  }, []);

  const { fieldForm, handleSubmit } = useFieldForm({
    configs: configs,
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationKey: ['authorizeWithPassword'],
    mutationFn: (formData: FormData) => authorizeWithPassword(formData.username, formData.password),
    onSuccess: (data) => {
      if (data.accessToken && data.user?.id) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('userId', data.user?.id.toString());
        router.push('/artworks');
      }
    },
    onError: async (error: AxiosError<AuthorizeWithPasswordResponse>) => {
      if (error.response?.data) {
        await showError(error.response.data.message);
      }
    },
  });

  const onSubmit = async (formData: FormData) => {
    await mutation.mutateAsync(formData);
  };

  return (
    <>
      <div className="bg-base-200 flex min-h-screen items-center">
        <div className="card mx-auto w-full max-w-md shadow-xl">
          <div className="bg-base-100 grid rounded-xl p-10 md:grid-cols-1">
            <div className="mb-10">
              <Image
                priority
                src="/images/light/logo.svg"
                alt="AKI ERP"
                width="auto"
                height="34.5px"
              />
            </div>

            <h2 className="text-center text-2xl font-semibold">Login</h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              {fieldForm}

              <div className="text-primary text-right">
                <Link href="/forgot-password">
                  <span className="hover:text-primary inline-block text-sm transition duration-200 hover:cursor-pointer hover:underline">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                className="btn btn-primary w-full"
                isLoading={mutation.isLoading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
