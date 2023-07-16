import { FormEvent, useState } from 'react';

import { AxiosError } from 'axios';
import InputText, { InputTextProps } from 'components/Input/InputText';
import ErrorText from 'components/Typography/ErrorText';
import { authorizeWithPassword } from 'data-access/apis/authorizations.api';
import { AuthorizeWithPasswordResponse } from 'data-access/models';
import { Link } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

const INITIAL_LOGIN_DATA = {
  username: '',
  password: '',
};

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_DATA);

  const mutation = useMutation({
    mutationKey: ['authorizeWithPassword'],
    mutationFn: () => authorizeWithPassword(loginObj.username, loginObj.password),
    onSuccess: (data) => {
      // Call API to check user credentials and save token in localStorage
      localStorage.setItem('token', data.accessToken);
      window.location.href = '/app/welcome';
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

  const updateFormValue = ({ updateType, value }: { updateType: keyof typeof INITIAL_LOGIN_DATA; value: string }) => {
    setErrorMessage('');
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-md  shadow-xl">
        <div className="grid  md:grid-cols-1  bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <img className="mx-auto mb-10" src="/assets/dark/logo.svg" alt="AKI" />
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="username"
                  defaultValue={loginObj.username}
                  updateType="username"
                  containerStyle="mt-4"
                  labelTitle="Username"
                  updateFormValue={updateFormValue as InputTextProps['updateFormValue']}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue as InputTextProps['updateFormValue']}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button type="submit" className={'btn mt-2 w-full btn-primary' + (mutation.isLoading ? ' loading' : '')}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
