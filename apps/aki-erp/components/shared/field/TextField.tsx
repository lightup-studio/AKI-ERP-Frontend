import { useState } from 'react';

interface TextFieldProps {
  labelTitle?: string | React.ReactElement;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue?: (options: Pick<TextFieldProps, 'updateType'> & { value?: string }) => void;
  updateType?: string;
}

const TextField = ({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}: TextFieldProps) => {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (val: string) => {
    setValue(val);
    updateFormValue?.({ updateType, value: val });
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={'label-text text-base-content ' + labelStyle}>{labelTitle}</span>
      </label>
      <input
        type={type || 'text'}
        value={value}
        placeholder={placeholder || ''}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input  input-bordered w-full "
      />
    </div>
  );
};

export type { TextFieldProps };

export default TextField;
