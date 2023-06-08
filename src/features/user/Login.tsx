import { FormEvent, useState } from 'react';

import InputText, { InputTextProps } from 'components/Input/InputText';
import ErrorText from 'components/Typography/ErrorText';
import { Link } from 'react-router-dom';

const INITIAL_LOGIN_DATA = {
  password: '',
  emailId: '',
};

function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_DATA);

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginObj.emailId.trim() === '')
      return setErrorMessage('請輸入帳號');
    if (loginObj.password.trim() === '')
      return setErrorMessage('請輸入密碼');
    else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      localStorage.setItem('token', 'DumyTokenHere');
      setLoading(false);
      window.location.href = '/app/welcome';
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
      <div className="card mx-auto w-full max-w-md  shadow-xl">
        <div className="grid  md:grid-cols-1  bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <img className="mx-auto mb-10" src='/assets/dark/logo.svg' alt='AKI'/>
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="emailId"
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Accout"
                  updateFormValue={
                    updateFormValue as InputTextProps['updateFormValue']
                  }
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={
                    updateFormValue as InputTextProps['updateFormValue']
                  }
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
              <button
                type="submit"
                className={
                  'btn mt-2 w-full btn-primary' + (loading ? ' loading' : '')
                }
              >
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
