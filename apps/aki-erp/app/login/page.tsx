'use client';

import { useRef, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { AxiosError } from 'axios';
import cx from 'classnames';
import { authorizeWithPassword } from 'data-access/apis/authorizations.api';
import { AuthorizeWithPasswordResponse } from 'data-access/models';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';

import { useResizeAndToggle } from '@aki-erp/storybook-ui';
import Button from '@components/shared/Button';
import Image from '@components/shared/Image';
import axiosInstance from '@contexts/axios';
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

const ResizeAndToggle = () => {
  const targetRef = useRef(null);

  const [showBlock, setShowBlock] = useLocalStorage('block-show', false);
  console.log('🐞 ~ showBlock:', showBlock);

  const [width, setWidth] = useLocalStorage('block-width', 100);
  console.log('🐞 ~ width:', width);

  const { dragNode, setShow, show } = useResizeAndToggle(targetRef, {
    getCacheStateAndAction: () => [
      {
        show: showBlock!,
        width: width!,
      },
      ({ show, width }) => {
        // those two will save into cache when end move mode, like save into storage
        console.log('🐞 ~ width:', width);
        console.log('🐞 ~ show:', show);
        setShowBlock(show);
        setWidth(width);
      },
    ],
    direction: 'right',
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? 'hide' : 'show'}
      </button>
      <div
        ref={targetRef}
        className={cx(
          'bg-blue-300 relative h-8',
          show ? 'min-w-[200px] max-w-[80vw]' : '!w-0 overflow-hidden'
        )}
      >
        {dragNode}
      </div>
    </>
  );
};

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
    <>
      <ResizeAndToggle />
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-md shadow-xl">
          <div className="grid md:grid-cols-1 p-10 bg-base-100 rounded-xl">
            <div className="mb-10">
              <Image
                priority
                src="/images/dark/logo.svg"
                alt="AKI ERP"
                width="auto"
                height="34.5px"
              />
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

              <Button
                type="submit"
                className="btn w-full btn-primary"
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
