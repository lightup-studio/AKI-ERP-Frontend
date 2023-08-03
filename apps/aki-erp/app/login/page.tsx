'use client';

import Button from '@components/shared/Button';
import axiosInstance from '@contexts/axios';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import { showError } from '@utils/swalUtil';
import { AxiosError } from 'axios';
import { authorizeWithPassword } from 'data-access/apis/authorizations.api';
import { AuthorizeWithPasswordResponse } from 'data-access/models';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

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

  const { fieldForm, handleSubmit } = useFieldForm({
    configs: configs,
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationKey: ['authorizeWithPassword'],
    mutationFn: (formData: FormData) => authorizeWithPassword(formData.username, formData.password),
    onSuccess: (data) => {
      localStorage.setItem('userId', data.user?.id?.toString() ?? '');
      axiosInstance.defaults.headers['Authorization'] = data.accessToken;

      router.push('/artworks');
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
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-md shadow-xl">
        <div className="grid md:grid-cols-1 p-10 bg-base-100 rounded-xl">
          <div className="relative mb-10 h-8">
            <Image src="/images/dark/logo.svg" alt="AKI" fill />
          </div>

          <h2 className="text-2xl font-semibold text-center">Login</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            {fieldForm}

            <div className="text-right text-primary">
              <Link href="/forgot-password">
                <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                  Forgot Password?
                </span>
              </Link>
            </div>

            <Button type="submit" className="btn w-full btn-primary" isLoading={mutation.isLoading}>
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
