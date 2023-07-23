'use client';

import TextField, { TextFieldProps } from '@components/shared/field/TextField';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { authorizeWithPassword } from 'data-access/apis/authorizations.api';
import { AuthorizeWithPasswordResponse } from 'data-access/models';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const INITIAL_LOGIN_DATA = {
  username: '',
  password: '',
};

const Login = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_DATA);

  const mutation = useMutation({
    mutationKey: ['authorizeWithPassword'],
    mutationFn: () => authorizeWithPassword(loginObj.username, loginObj.password),
    onSuccess: (data) => {
      // Call API to check user credentials and save token in localStorage
      localStorage.setItem('token', data.accessToken);
      router.push('/inventory');
    },
    onError: (error: AxiosError<AuthorizeWithPasswordResponse>) => {
      if (error.response?.data) {
        setErrorMessage(error.response.data.message);
      }
    },
  });

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginObj.username.trim() === '') return setErrorMessage('請輸入帳號');
    if (loginObj.password.trim() === '') return setErrorMessage('請輸入密碼');
    else {
      mutation.mutate();
    }
  };

  const updateFormValue = ({
    updateType,
    value,
  }: {
    updateType: keyof typeof INITIAL_LOGIN_DATA;
    value: string;
  }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-md shadow-xl">
        <div className="grid md:grid-cols-1 p-10 bg-base-100 rounded-xl">
          <div className="relative mb-10 h-8">
            <Image src="/images/dark/logo.svg" alt="AKI" fill />
          </div>
          <h2 className="text-2xl font-semibold text-center">Login</h2>
          <form onSubmit={(e) => submitForm(e)}>
            <div className="mb-4">
              <TextField
                type="username"
                defaultValue={loginObj.username}
                updateType="username"
                containerStyle="mt-4"
                labelTitle="Username"
                updateFormValue={updateFormValue as TextFieldProps['updateFormValue']}
              />

              <TextField
                defaultValue={loginObj.password}
                type="password"
                updateType="password"
                containerStyle="mt-4"
                labelTitle="Password"
                updateFormValue={updateFormValue as TextFieldProps['updateFormValue']}
              />
            </div>

            <div className="text-right text-primary">
              <Link href="/forgot-password">
                <span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                  Forgot Password?
                </span>
              </Link>
            </div>

            <p className="text-center text-error mt-8">{errorMessage}</p>
            <button
              type="submit"
              className={'btn mt-2 w-full btn-primary' + (mutation.isLoading ? ' loading' : '')}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
