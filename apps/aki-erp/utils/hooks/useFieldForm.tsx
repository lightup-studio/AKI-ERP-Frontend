import { DatePickerField, TextField } from '@components/shared/field';
import { get } from 'lodash-es';
import { Controller, FieldValues, Path, UseFormProps, useForm } from 'react-hook-form';

interface FieldConfig<TFieldValues = any> {
  type: 'TEXT' | 'DATE' | 'PASSWORD';
  name: Path<TFieldValues>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

interface useFieldFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  configs: FieldConfig<TFieldValues>[];
}

const useFieldForm = <TFieldValues extends FieldValues = FieldValues, TContext = any>({
  configs = [],
  ...props
}: useFieldFormProps<TFieldValues, TContext>) => {
  const {
    control,
    formState: { errors },
    ...useFormReturn
  } = useForm<TFieldValues, TContext>(props);

  const fieldForm = configs.map((config) => {
    const { type, name } = config;
    const errorMsg = get(errors, `${name}.message`) as string;
    const fieldProps = { ...config, errorMsg };

    const controller = (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'TEXT':
            case 'PASSWORD':
              return <TextField {...fieldProps} {...field} />;

            case 'DATE':
              return <DatePickerField {...fieldProps} {...field} />;

            default:
              return <></>;
          }
        }}
      />
    );

    return (
      <section key={name} className="flex flex-col gap-2">
        <label className="font-bold" htmlFor={name}>
          {config.label}
        </label>
        {controller}
        {errorMsg && <p className="text-error text-xs italic">{errorMsg}</p>}
      </section>
    );
  });

  return { fieldForm, control, formState: { errors }, ...useFormReturn };
};

export type { FieldConfig };

export default useFieldForm;
