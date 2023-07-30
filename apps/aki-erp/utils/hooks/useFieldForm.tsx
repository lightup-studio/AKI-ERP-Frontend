import { DatePickerField } from '@components/shared/field';
import { yupResolver } from '@hookform/resolvers/yup';
import { get } from 'lodash-es';
import { useMemo } from 'react';
import { Controller, FieldValues, Path, UseFormProps, useForm } from 'react-hook-form';
import * as yup from 'yup';

interface FieldConfig<TFieldValues> {
  type: 'DATE';
  name: Path<TFieldValues>;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  validated?: any;
}

interface useFieldFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any>
  extends UseFormProps<TFieldValues, TContext> {
  configs: FieldConfig<TFieldValues>[];
}

const useFieldForm = <TFieldValues extends FieldValues = FieldValues, TContext = any>({
  configs = [],
  ...props
}: useFieldFormProps<TFieldValues, TContext>) => {
  const schema = useMemo(
    () =>
      yup.object({
        ...configs.reduce<{ [key: string]: any }>((prev, curr) => {
          if (curr && curr.validated) prev[curr.name] = curr.validated;
          return prev;
        }, {}),
      }),
    [configs]
  );

  const {
    control,
    formState: { errors },
    ...useFormReturn
  } = useForm<TFieldValues, TContext>({
    resolver: yupResolver<any>(schema),
    ...props,
  });

  const fieldForm = configs.map((config) => {
    const { type, name } = config;
    const errorMsg = get(errors, `${name}.message`) as string;
    const fieldProps = { errorMsg };

    const controller = (
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          switch (type) {
            case 'DATE':
              return <DatePickerField {...fieldProps} {...field} />;

            default:
              return <></>;
          }
        }}
      />
    );

    return (
      <section key={name}>
        <label className="font-bold mb-2" htmlFor={name}>
          {config.label}
        </label>
        {controller}
        <p className="text-error text-xs italic">{errorMsg}</p>
      </section>
    );
  });

  return { fieldForm, control, ...useFormReturn };
};

export default useFieldForm;
