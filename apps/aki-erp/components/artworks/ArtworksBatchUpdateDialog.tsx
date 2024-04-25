'use client';

import { useEffect } from 'react';

import Button from '@components/shared/Button';
import PageTitle from '@components/shared/PageTitle';
import { patchArtwork } from '@data-access/apis';
import { ArtworkDetail, TransferOrder } from '@data-access/models';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useMutation } from '@tanstack/react-query';
import { showError, showSuccess } from '@utils/swalUtil';
import cx from 'classnames';
import { useForm } from 'react-hook-form';
import ArtworksBatchUpdateTable from './ArtworksBatchUpdateTable';

type FormData = {
  artworks: ArtworkDetail[];
};

interface ArtworksBatchUpdateDialogProsp {
  list: Pick<TransferOrder, 'id' | 'artworks'>[];
  isOpen: boolean;
  onClose?: () => void;
}

const ArtworksBatchUpdateDialog: React.FC<ArtworksBatchUpdateDialogProsp> = ({
  list,
  isOpen = false,
  onClose,
}) => {
  const { register, handleSubmit } = useForm<FormData>();

  const updateMutation = useMutation({
    mutationFn: (artworks: ArtworkDetail[]) => {
      return Promise.all(
        artworks.map((artwork) =>
          patchArtwork(artwork.id, {
            warehouseId: Number(artwork.warehouseId),
            metadata: artwork.metadata,
          }),
        ),
      );
    },
  });

  useEffect(() => {
    if (updateMutation.isSuccess) showSuccess('更新成功！');
    if (updateMutation.isError) showError('更新失敗！');
  }, [updateMutation.isSuccess]);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    mainElement.scrollTo(0, 0);
    mainElement.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      mainElement.style.overflow = 'auto';
    };
  }, [isOpen]);

  const onSubmit = async (formData: FormData) => {
    await updateMutation.mutateAsync(formData.artworks);
  };

  return (
    <div
      className={cx('modal absolute z-10', {
        'modal-open': isOpen,
      })}
    >
      <div className="modal-box flex max-w-none flex-col overflow-hidden p-0">
        <div className="border-b-base-content m-4 mb-0 flex items-baseline justify-between border-b pb-2 text-2xl font-bold">
          <h3>Batch Update Store Info</h3>
        </div>

        <div className="my-3 mr-2 min-h-[60vh] overflow-y-auto px-4">
          <div className="relative flex flex-col gap-2">
            {list
              .filter((item) => item.artworks?.length)
              .map((item) => (
                <div key={item.id}>
                  <h4 className="bg-base-content text-base-200 sticky top-0 z-10 rounded-lg p-2 text-xl font-bold">
                    <PageTitle /> {item.id}
                  </h4>
                  <div className="overflow-x-auto">
                    <ArtworksBatchUpdateTable data={item.artworks} register={register} />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-base-100 mb-4 flex justify-center gap-2 md:col-span-2">
          <Button
            className="btn btn-success"
            isLoading={updateMutation.isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            <CheckIcon className="w-4"></CheckIcon> 儲存
          </Button>
          <button className="btn btn-error btn-base-200" type="button" onClick={onClose}>
            <XMarkIcon className="w-4"></XMarkIcon> 取消
          </button>
        </div>
      </div>

      <label className="modal-backdrop" onClick={onClose}>
        Close
      </label>
    </div>
  );
};

export default ArtworksBatchUpdateDialog;
