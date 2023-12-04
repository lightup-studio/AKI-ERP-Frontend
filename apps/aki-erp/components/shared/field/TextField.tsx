import classNames from 'classnames';
import React from 'react';

interface TextFieldProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  errorMsg?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { defaultValue, errorMsg, ...props },
  ref,
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
