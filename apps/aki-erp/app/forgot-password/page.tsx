'use client';

import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import useFieldForm, { FieldConfig } from '@utils/hooks/useFieldForm';
import Link from 'next/link';
import { useState } from 'react';
import * as yup from 'yup';

type FormData = {
  emailId: string;
};

const schema = yup.object().shape({
  emailId: yup.string().required('Email Id is required! (use any value)'),
});

const configs: FieldConfig<FormData>[] = [
  {
    type: 'TEXT',
    name: 'emailId',
    label: 'Email Id',
  },
];

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  const { fieldForm, handleSubmit } = useFieldForm({
    configs: configs,
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData: FormData) => {
    console.log(formData);
    setLinkSent(true);
  };

  return (
    <div className="bg-base-200 flex min-h-screen items-center">
      <div className="card mx-auto w-full max-w-md shadow-xl">
        <div className="bg-base-100 grid rounded-xl p-10 md:grid-cols-1">
          <h2 className="mb-2 text-center text-2xl font-semibold">Forgot Password</h2>

          {linkSent && (
            <>
              <div className="mt-8 text-center">
                <CheckCircleIcon className="text-success inline-block w-32" />
              </div>
              <p className="my-4 text-center text-xl font-bold">Link Sent</p>
              <p className="mt-4 mb-8 text-center font-semibold">
                Check your email to reset password
              </p>
              <div className="mt-4 text-center">
                <Link href="/login">
                  <button className="btn btn-block btn-primary">Login</button>
                </Link>
              </div>
            </>
          )}

          {!linkSent && (
            <>
              <p className="my-8 text-center font-semibold">
                We will send password reset link on your email Id
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">{fieldForm}</div>

                <button
                  type="submit"
                  className={'btn btn-primary mt-2 w-full' + (loading ? ' loading' : '')}
                >
                  Send Reset Link
                </button>

                <div className="mt-4 text-center">
                  Don't have an account yet?{' '}
                  <Link href="/register">
                    <button className="hover:text-primary inline-block transition duration-200 hover:cursor-pointer hover:underline">
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
