import classNames from 'classnames';
import React from 'react';

interface TextFieldProps {
  id?: string;
  min?: number | string;
  max?: number | string;
  type?: string;
  name?: string;
  value: string | number;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  errorMsg?: string;
  autoFocus?: boolean;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { errorMsg, ...props },
  ref
) {
  const { name, value } = props;

  return (
    <input
      {...props}
      id={name}
      ref={ref}
      value={value || ''}
      className={classNames('input input-bordered w-full', { 'input-error': errorMsg })}
    />
  );
});

export type { TextFieldProps };

export default TextField;
