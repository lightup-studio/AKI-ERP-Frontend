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
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">{fieldForm}</div>

                <button
                  type="submit"
                  className={'btn mt-2 w-full btn-primary' + (loading ? ' loading' : '')}
                >
                  Send Reset Link
                </button>

                <div className="text-center mt-4">
                  Don't have an account yet?{' '}
                  <Link href="/register">
                    <button className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
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
