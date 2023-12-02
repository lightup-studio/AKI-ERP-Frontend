import { useEffect } from 'react';

import { formSchema } from '@constants/company.formSchema';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import cx from 'classnames';
import { updatePartner } from 'data-access/apis/partners.api';
import { CompanyPartner } from 'data-access/models';
import { useForm } from 'react-hook-form';

const UpdateCompanyDialog = ({
  isOpen = false,
  data,
  onClose,
}: {
  isOpen: boolean;
  data?: CompanyPartner | null;
  onClose?: (data?: CompanyPartner) => void;
}) => {
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      return;
    }
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      mainElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<CompanyPartner>({
    resolver: yupResolver<any>(formSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const updateMutation = useMutation(
    (updatedData: CompanyPartner) => {
      return updatePartner(updatedData);
    },
    {
      onSuccess: (data) => {
        onClose?.(data);
      },
    },
  );

  const onSubmit = (data: CompanyPartner) => {
    updateMutation.mutateAsync(data);
  };

  return (
    <div
      className={cx('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <form
        className="modal-box max-w-none overflow-hidden flex flex-col p-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-bold m-4 pb-2 mb-0 text-2xl border-b-base-content border-b flex justify-between items-baseline">
          編輯廠商 {data?.id}
        </h3>

        <div className="my-3 mr-2 px-4 py-2">
          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1">
              <label className="font-bold">廠商姓名</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-32 text-center rounded-r-none', {
                    'input-error': errors.zhName,
                  })}
                  placeholder="中文姓名"
                  {...register('zhName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                <input
                  className={cx('input input-bordered w-56 text-center rounded-l-none', {
                    'input-error': errors.enName,
                  })}
                  placeholder="英文姓名"
                  {...register('enName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                {(errors.zhName || errors.enName) && (
                  <p className="absolute text-error text-xs italic">
                    {(errors.zhName || errors.enName)?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">電話</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.telephone,
                  })}
                  placeholder="請輸入電話"
                  {...register('telephone')}
                />
                {errors.telephone && (
                  <p className="absolute text-error text-xs italic">{errors.telephone?.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">Email</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors?.metadata?.email,
                  })}
                  placeholder="請輸入 Email"
                  {...register('metadata.email')}
                />
                {errors?.metadata?.email && (
                  <p className="absolute text-error text-xs italic">
                    {errors.metadata.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold">地址</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-full text-center', {
                    'input-error': errors.address,
                  })}
                  placeholder="請輸入地址"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="absolute text-error text-xs italic">{errors.address?.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100 my-4 md:col-span-2 flex gap-2 justify-center">
          <button className="btn btn-success">
            <CheckIcon className="w-4"></CheckIcon> 儲存
          </button>
          <button className="btn btn-error btn-base-200" type="button" onClick={() => onClose?.()}>
            <XMarkIcon className="w-4"></XMarkIcon> 取消
          </button>
        </div>
      </form>
      <label className="modal-backdrop" onClick={() => onClose?.()}>
        Close
      </label>
    </div>
  );
};

export default UpdateCompanyDialog;
