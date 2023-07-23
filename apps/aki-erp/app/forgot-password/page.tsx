'use client';

import InputText from '@components/shared/field/TextField';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

const ForgotPassword = () => {
  const INITIAL_USER_OBJ = {
    emailId: '',
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (userObj.emailId.trim() === '')
      return setErrorMessage('Email Id is required! (use any value)');
    else {
      setLoading(true);
      // Call API to send password reset link
      setLoading(false);
      setLinkSent(true);
    }
  };

  const updateFormValue = ({ updateType, value }: any) => {
    setErrorMessage('');
    setUserObj({ ...userObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-md shadow-xl">
        <div className="grid md:grid-cols-1 p-10 bg-base-100 rounded-xl">
          <h2 className="text-2xl font-semibold mb-2 text-center">Forgot Password</h2>

          {linkSent && (
            <>
              <div className="text-center mt-8">
                <CheckCircleIcon className="inline-block w-32 text-success" />
              </div>
              <p className="my-4 text-xl font-bold text-center">Link Sent</p>
              <p className="mt-4 mb-8 font-semibold text-center">
                Check your email to reset password
              </p>
              <div className="text-center mt-4">
                <Link href="/login">
                  <button className="btn btn-block btn-primary ">Login</button>
                </Link>
              </div>
            </>
          )}

          {!linkSent && (
            <>
              <p className="my-8 font-semibold text-center">
                We will send password reset link on your email Id
              </p>
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4">
                  <InputText
                    type="emailId"
                    defaultValue={userObj.emailId}
                    updateType="emailId"
                    containerStyle="mt-4"
                    labelTitle="Email Id"
                    updateFormValue={updateFormValue}
                  />
                </div>

                <p className="text-center text-error mt-12">{errorMessage}</p>
                <button
                  type="submit"
                  className={'btn mt-2 w-full btn-primary' + (loading ? ' loading' : '')}
                >
                  Send Reset Link
                </button>

                <div className="text-center mt-4">
                  Don't have an account yet?{' '}
                  <Link href="/register">
                    <button className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                      Register
                    </button>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
