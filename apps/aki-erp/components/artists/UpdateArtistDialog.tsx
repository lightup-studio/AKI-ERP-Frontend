import { useEffect } from 'react';

import cx from 'classnames';
import { updatePartner } from 'data-access/apis/partners.api';
import { ArtistPartner } from 'data-access/models';
import { useForm } from 'react-hook-form';

import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { formSchema } from '@constants/artists.formSchema';

const UpdateArtistDialog = ({
  isOpen = false,
  data,
  onClose,
}: {
  isOpen: boolean;
  data?: ArtistPartner | null;
  onClose?: (data?: ArtistPartner) => void;
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
  } = useForm<ArtistPartner>({
    resolver: yupResolver<any>(formSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const updateMutation = useMutation(
    (updatedData: ArtistPartner) => {
      return updatePartner(updatedData);
    },
    {
      onSuccess: (data) => {
        onClose?.(data);
      },
    },
  );

  const onSubmit = (data: ArtistPartner) => {
    updateMutation.mutateAsync(data);
  };

  return (
    <div
      className={cx('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <form
        className="modal-box flex max-w-none flex-col overflow-hidden p-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="border-b-base-content m-4 mb-0 flex items-baseline justify-between border-b pb-2 text-2xl font-bold">
          編輯藝術家 {data?.id}
        </h3>

        <div className="my-3 mr-2 px-4 py-2">
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold">藝術家姓名</label>
              <div className="relative flex-1">
                <input
                  className={cx('input input-bordered w-32 rounded-r-none text-center', {
                    'input-error': errors.zhName,
                  })}
                  placeholder="中文姓名"
                  {...register('zhName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                <input
                  className={cx('input input-bordered w-56 rounded-l-none text-center', {
                    'input-error': errors.enName,
                  })}
                  placeholder="英文姓名"
                  {...register('enName')}
                  onBlur={() => trigger(['zhName', 'enName'])}
                />
                {(errors.zhName || errors.enName) && (
                  <p className="text-error absolute text-xs italic">
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
                  <p className="text-error absolute text-xs italic">{errors.telephone?.message}</p>
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
                  <p className="text-error absolute text-xs italic">
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
                  <p className="text-error absolute text-xs italic">{errors.address?.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100 my-4 flex justify-center gap-2 md:col-span-2">
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

export default UpdateArtistDialog;
